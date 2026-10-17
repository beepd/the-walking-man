// The Walking Man - start screen, buttons, footstep sound, and the two cities.
//
// The footsteps are not audio files. We make them with the Web Audio API:
// a short burst of filtered noise (the scuff) plus a quick low thump (the weight).

const body     = document.body;
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('toggle');
const soundBtn = document.getElementById('sound');

const STEP_MS = 600;       // one footstep every 0.6s (matches the 'bob' animation in the CSS)

let audio = null;          // the AudioContext; created on the first tap
let noise = null;          // a reusable buffer of white noise
let soundOn = true;
let timer = null;          // the pending "next footstep" timer
let stepNumber = 0;        // used to alternate left / right


// ---------- Sound ----------

function setUpAudio() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();

    // 0.15 seconds of random noise, made once and reused for every step
    noise = audio.createBuffer(1, Math.floor(audio.sampleRate * 0.15), audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (audio.state === 'suspended') audio.resume();
}

function playStep() {
  if (!audio || !soundOn) return;
  const now = audio.currentTime;
  stepNumber++;

  // Left foot sits slightly left, right foot slightly right
  const pan = audio.createStereoPanner();
  pan.pan.value = stepNumber % 2 ? -0.2 : 0.2;
  pan.connect(audio.destination);

  // The scuff: noise through a low-pass filter, with a fast fade in and a slower fade out
  const scuff = audio.createBufferSource();
  scuff.buffer = noise;
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 450 + Math.random() * 250;   // a little variation so it is not robotic
  const scuffGain = audio.createGain();
  scuffGain.gain.setValueAtTime(0, now);
  scuffGain.gain.linearRampToValueAtTime(0.16, now + 0.006);
  scuffGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  scuff.connect(filter).connect(scuffGain).connect(pan);
  scuff.start(now);
  scuff.stop(now + 0.15);

  // The thump: a low tone that drops in pitch very quickly
  const thump = audio.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(110, now);
  thump.frequency.exponentialRampToValueAtTime(45, now + 0.09);
  const thumpGain = audio.createGain();
  thumpGain.gain.setValueAtTime(0.0001, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  thump.connect(thumpGain).connect(pan);
  thump.start(now);
  thump.stop(now + 0.12);
}


// ---------- Keeping the sound in time with the walk ----------
// Instead of running our own clock, we ask the CSS animation where it is right now
// and wait until it reaches the next footfall. If the animation pauses, so does the sound.

function scheduleNextStep(justPlayed = false) {
  clearTimeout(timer);
  if (!body.classList.contains('started') || body.classList.contains('paused') || body.classList.contains('resting') || document.hidden) return;

  const bob = document.querySelector('.bob').getAnimations()[0];
  if (!bob) return;

  const phase = Number(bob.currentTime) % STEP_MS;   // how far into the current step we are
  let wait = STEP_MS - phase;                        // time left until the foot lands

  // The timer can fire a few milliseconds before the animation reaches the footfall.
  // Then "time left" would be tiny and we would play the same step twice.
  // So right after a step, if the next footfall looks too close, aim for the one after it.
  if (justPlayed && wait < STEP_MS / 2) wait += STEP_MS;

  timer = setTimeout(() => {
    playStep();
    scheduleNextStep(true);
  }, wait);
}


// ---------- The two cities, the numbers, and the real clock ----------
// On the left is the city he is leaving, on the right the one he is heading to.
// As he walks, the left one shrinks and the right one grows.
// Every frame we ask journey.js: "where is he right now?" and redraw from the answer.

const cityLeft   = document.getElementById('cityLeft');
const cityRight  = document.getElementById('cityRight');
const labelLeft  = document.getElementById('labelLeft');
const labelRight = document.getElementById('labelRight');

const hudElapsed   = document.getElementById('hudElapsed');
const hudNextLabel = document.getElementById('hudNextLabel');
const hudCountdown = document.getElementById('hudCountdown');
const hudStatus    = document.getElementById('hudStatus');
const hudKm        = document.getElementById('hudKm');

const STATUS_TEXT = {
  walking:   'Walking',
  breakfast: 'Having breakfast',
  lunch:     'Having lunch',
  snack:     'Evening snack',
  dinner:    'Having dinner',
  sleeping:  'Sleeping',
  waiting:   'About to set off',
};

let shownLeg = -1;         // which leg the pictures currently show

function showLeg(leg) {
  cityLeft.innerHTML  = leg.from.art;
  cityRight.innerHTML = leg.to.art;
  labelLeft.textContent  = leg.from.name;
  labelRight.textContent = leg.to.name;
  hudNextLabel.textContent = 'Next stop: ' + leg.to.name;
  shownLeg = leg.index;
}

// progress goes from 0 (just left) to 1 (arriving)
function drawCities(progress) {
  const leftScale  = 1 - 0.75 * progress;      // 100% -> 25%
  const rightScale = 0.25 + 0.75 * progress;   // 25%  -> 100%
  cityLeft.style.transform  = `scale(${leftScale})`;
  cityRight.style.transform = `scale(${rightScale})`;
  cityLeft.style.opacity    = 1 - 0.4 * progress;
  cityRight.style.opacity   = 0.6 + 0.4 * progress;
}

// 93784000 ms  ->  "1d 02h 03m 04s"
function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor(total % 86400 / 3600);
  const m = Math.floor(total % 3600 / 60);
  const s = total % 60;
  const two = n => String(n).padStart(2, '0');
  return (d > 0 ? d + 'd ' : '') + two(h) + 'h ' + two(m) + 'm ' + two(s) + 's';
}

// Only touch the page when the text really changed
function setText(element, text) {
  if (element.textContent !== text) element.textContent = text;
}

function frame() {
  const state = journeyAt(Date.now());

  if (state.leg.index !== shownLeg) showLeg(state.leg);
  drawCities(state.progress);

  // Meals and sleep: stand still, and stop the footsteps
  const resting = state.activity !== 'walking';
  if (body.classList.contains('resting') !== resting) {
    body.classList.toggle('resting', resting);
    scheduleNextStep();            // restart (or stop) the footstep timer
  }

  setText(hudElapsed,   formatDuration(state.msOnRoad));
  setText(hudCountdown, formatDuration(state.msToArrival));
  setText(hudKm,        Math.round(state.totalKm).toLocaleString() + ' km');
  const toGo = Math.max(0, Math.round(state.leg.km - state.kmInLeg));
  setText(hudStatus,    (STATUS_TEXT[state.activity] || '') + '  \u00b7  ' + toGo + ' km to go');

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);


// ---------- Buttons ----------

startBtn.addEventListener('click', () => {
  setUpAudio();                       // must happen inside a tap, or the browser blocks sound
  body.classList.add('started');      // un-freezes the animations and hides the start screen
  goFullscreenOnPhones();
  scheduleNextStep();
});

pauseBtn.addEventListener('click', () => {
  const paused = body.classList.toggle('paused');
  pauseBtn.textContent = paused ? 'Walk' : 'Pause';
  scheduleNextStep();                 // stops the timer if paused, restarts it if walking
});

soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? 'Sound: on' : 'Sound: off';
});

// Do not make noise in a background tab
document.addEventListener('visibilitychange', () => scheduleNextStep());


// ---------- Landscape on phones ----------
// Browsers only allow locking the screen to landscape while in fullscreen, and iPhones
// do not allow it at all. So we try it quietly, and the "rotate your phone" screen
// in the CSS covers everyone else.

function goFullscreenOnPhones() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const page = document.documentElement;
  if (!isTouchDevice || !page.requestFullscreen) return;

  page.requestFullscreen()
    .then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'))
    .catch(() => { /* not supported here - fine */ });
}
