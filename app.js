// The Walking Man - start screen, buttons, footstep sound, and the two cities.
//
// The footsteps are not audio files. We make them with the Web Audio API:
// a short burst of filtered noise (the scuff) plus a quick low thump (the weight).

const body     = document.body;
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('toggle');
const soundBtn = document.getElementById('sound');

const STEP_MS = 600;       // one footstep every 0.6s (matches the 'bob' animation in the CSS)
const STROKE_MS = 3000;    // one oar stroke every 3s (matches the 'oar-stroke' animation in the CSS)

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


// ---------- Sea sounds ----------
// While rowing there is a gentle background of waves and breeze, and a splash with each oar stroke.
// Both are made from noise: the waves are low rumble that swells and fades slowly,
// the breeze is a soft hiss that comes and goes even more slowly.

let sea = null;            // the running ambience: { master, sources }

function makeLoopingNoise(seconds) {
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * seconds), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

// One layer of sea sound: noise -> filter -> volume that a slow wobble raises and lowers
function seaLayer(filterType, frequency, q, baseVolume, wobbleDepth, wobbleHz, destination) {
  const noiseSource = makeLoopingNoise(3);
  const filter = audio.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const volume = audio.createGain();
  volume.gain.value = baseVolume;

  const wobble = audio.createOscillator();         // the slow swell
  wobble.frequency.value = wobbleHz;
  const wobbleAmount = audio.createGain();
  wobbleAmount.gain.value = wobbleDepth;
  wobble.connect(wobbleAmount).connect(volume.gain);

  noiseSource.connect(filter).connect(volume).connect(destination);
  noiseSource.start();
  wobble.start();
  return [noiseSource, wobble];
}

function startSea() {
  if (sea || !audio) return;
  const master = audio.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(1, audio.currentTime + 1.5);   // fade in
  master.connect(audio.destination);
  const sources = [
    ...seaLayer('lowpass',  420, 0.7, 0.07, 0.05, 0.11, master),     // waves
    ...seaLayer('bandpass', 750, 0.5, 0.022, 0.015, 0.07, master),   // breeze
  ];
  sea = { master, sources };
}

function stopSea() {
  if (!sea) return;
  const old = sea;
  sea = null;
  old.master.gain.cancelScheduledValues(audio.currentTime);
  old.master.gain.setValueAtTime(old.master.gain.value, audio.currentTime);
  old.master.gain.linearRampToValueAtTime(0, audio.currentTime + 0.8);   // fade out, then switch off
  setTimeout(() => old.sources.forEach(node => { try { node.stop(); } catch (e) { /* already stopped */ } }), 1000);
}

// Sea ambience should play only while rowing, with sound on, started, not paused, and the tab visible
function updateSea() {
  const wanted = body.classList.contains('rowing') && body.classList.contains('started') &&
                 !body.classList.contains('paused') && soundOn && !document.hidden;
  if (wanted) startSea(); else stopSea();
}

// The oar entering the water: a splash of noise and a soft knock from the oarlock
function playStroke() {
  if (!audio || !soundOn) return;
  const now = audio.currentTime;

  const splash = audio.createBufferSource();
  splash.buffer = noise;
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1400;
  const splashGain = audio.createGain();
  splashGain.gain.setValueAtTime(0, now);
  splashGain.gain.linearRampToValueAtTime(0.13, now + 0.02);
  splashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  splash.connect(filter).connect(splashGain).connect(audio.destination);
  splash.start(now);
  splash.stop(now + 0.15);

  const knock = audio.createOscillator();
  knock.type = 'sine';
  knock.frequency.setValueAtTime(150, now);
  knock.frequency.exponentialRampToValueAtTime(80, now + 0.07);
  const knockGain = audio.createGain();
  knockGain.gain.setValueAtTime(0.0001, now);
  knockGain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
  knockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  knock.connect(knockGain).connect(audio.destination);
  knock.start(now);
  knock.stop(now + 0.12);
}


// ---------- Keeping the sound in time with the walk ----------
// Instead of running our own clock, we ask the CSS animation where it is right now
// and wait until it reaches the next footfall. If the animation pauses, so does the sound.

function scheduleNextStep(justPlayed = false) {
  clearTimeout(timer);
  updateSea();                                         // the sea ambience follows the same on/off conditions
  if (!body.classList.contains('started') || body.classList.contains('paused') || body.classList.contains('resting') || document.hidden) return;

  // Walking has a footstep every 0.6s, rowing has an oar stroke every 3s.
  const rowing   = body.classList.contains('rowing');
  const period   = rowing ? STROKE_MS : STEP_MS;
  const animated = (rowing ? document.getElementById('oarNear') : document.querySelector('.bob')).getAnimations()[0];
  if (!animated) return;

  const phase = Number(animated.currentTime) % period;   // how far into the current step or stroke we are
  let wait = period - phase;                           // time left until the foot lands (or the blade drops in)

  // The timer can fire a few milliseconds before the animation reaches the footfall.
  // Then "time left" would be tiny and we would play the same sound twice.
  // So right after a sound, if the next one looks too close, aim for the one after it.
  if (justPlayed && wait < period / 2) wait += period;

  timer = setTimeout(() => {
    if (rowing) playStroke(); else playStep();
    scheduleNextStep(true);
  }, wait);
}


// ---------- The clock: real time, or a sped-up demo ----------
// Open the page with ?demo to watch the first leg (Mumbai to Pune) play in 60 seconds,
// then loop. Use ?demo=90 for 90 seconds, and so on. Without it, the page uses the real time.
// The demo starts counting when you tap "start", and everything else behaves as usual.

const demoParam   = new URLSearchParams(location.search).get('demo');
const DEMO_ON     = demoParam !== null;
const DEMO_SECONDS = Math.max(10, Number(demoParam) || 60);
// ?demo&row shows the rowing scene on the demo leg, so you can preview it before any sea leg exists
const FORCE_ROW   = new URLSearchParams(location.search).has('row');
let demoStartedAt = null;                    // set when the start button is tapped

function clockNow() {
  if (!DEMO_ON) return Date.now();
  if (demoStartedAt === null) return LAUNCH_MS;                      // frozen at the launch moment until the tap
  const firstLegMs = getLeg(0).endMs - LAUNCH_MS;                    // how much real journey time the demo covers
  const speedUp    = firstLegMs / (DEMO_SECONDS * 1000);
  const elapsed    = (performance.now() - demoStartedAt) % (DEMO_SECONDS * 1000);
  return LAUNCH_MS + elapsed * speedUp;
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

const MEALS = ['breakfast', 'lunch', 'snack', 'dinner'];

const hudClock = document.getElementById('hudClock');
const starsEl  = document.getElementById('stars');
const sunEl    = document.getElementById('sun');
const moonEl   = document.getElementById('moon');
const foodArt  = document.getElementById('foodArt');

let shownLeg = -1;         // which leg the pictures currently show
let shownDish = '';        // which dish is drawn in his hand

function showLeg(leg) {
  cityLeft.innerHTML  = leg.from.art;
  cityRight.innerHTML = leg.to.art;
  labelLeft.textContent  = leg.from.name;
  labelRight.textContent = leg.to.name;
  hudNextLabel.textContent = 'Next stop: ' + leg.to.name;
  shownLeg = leg.index;
}

let cityDim = 1;           // 1 in daylight, lower at night (set by drawSky)

// progress goes from 0 (just left) to 1 (arriving)
function drawCities(progress) {
  const leftScale  = 1 - 0.65 * progress;      // 100% -> 35%
  const rightScale = 0.35 + 0.65 * progress;   // 35%  -> 100%
  cityLeft.style.transform  = `scale(${leftScale})`;
  cityRight.style.transform = `scale(${rightScale})`;
  cityLeft.style.opacity    = (1 - 0.4 * progress) * cityDim;
  cityRight.style.opacity   = (0.6 + 0.4 * progress) * cityDim;
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

// ---------- The sky ----------
// The colours come from his local solar time. Each row is a moment of the day (in hours),
// and the page blends smoothly between the two rows either side of the current time.
//   top / bottom : the sky colours      ink    : the text colour at the top (dark by day, light by night)
//   low          : the text colour for the city names at the bottom (the horizon glows at sunset)
//   ground       : the dashed road      veil   : how much the cities fade into the sky
//   stars        : how visible the stars are
const SKY = [
  { h: 0,    top: '#0b1026', bottom: '#1b2a4a', low: '#ece7da', ink: '#ece7da', ground: '#56627d', veil: 0.45, stars: 1   },
  { h: 4.5,  top: '#0e1530', bottom: '#232f55', low: '#ece7da', ink: '#ece7da', ground: '#56627d', veil: 0.42, stars: 1   },
  { h: 5.5,  top: '#2b3a6e', bottom: '#8a6f9a', low: '#ece7da', ink: '#ece7da', ground: '#6f6a85', veil: 0.25, stars: 0.5 },
  { h: 6.5,  top: '#6ea3d6', bottom: '#ffc58f', low: '#2b2f36', ink: '#2b2f36', ground: '#9a8f7a', veil: 0.08, stars: 0   },
  { h: 8,    top: '#a6d3f2', bottom: '#fbefda', low: '#2b2f36', ink: '#2b2f36', ground: '#9a8f7a', veil: 0,    stars: 0   },
  { h: 11,   top: '#cfe6f5', bottom: '#f6efe2', low: '#2b2f36', ink: '#2b2f36', ground: '#9a8f7a', veil: 0,    stars: 0   },
  { h: 16,   top: '#cfe6f5', bottom: '#f6efe2', low: '#2b2f36', ink: '#2b2f36', ground: '#9a8f7a', veil: 0,    stars: 0   },
  { h: 17.5, top: '#a9cde6', bottom: '#f8dcb0', low: '#2b2f36', ink: '#2b2f36', ground: '#9a8f7a', veil: 0.02, stars: 0   },
  { h: 18.5, top: '#5d72ab', bottom: '#ff9f6b', low: '#2b2f36', ink: '#ece7da', ground: '#8a7f78', veil: 0.15, stars: 0   },
  { h: 19.5, top: '#232c5c', bottom: '#6b4a7a', low: '#ece7da', ink: '#ece7da', ground: '#6f6a85', veil: 0.33, stars: 0.6 },
  { h: 20.5, top: '#0e1530', bottom: '#232f55', low: '#ece7da', ink: '#ece7da', ground: '#56627d', veil: 0.42, stars: 1   },
  { h: 24,   top: '#0b1026', bottom: '#1b2a4a', low: '#ece7da', ink: '#ece7da', ground: '#56627d', veil: 0.45, stars: 1   },
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Blend two colours: t = 0 gives a, t = 1 gives b
function mixColour(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

function skyAt(hour) {
  let i = 0;
  while (i < SKY.length - 2 && hour >= SKY[i + 1].h) i++;
  const a = SKY[i], b = SKY[i + 1];
  const t = Math.min(1, Math.max(0, (hour - a.h) / (b.h - a.h)));
  return {
    top:    mixColour(a.top,    b.top,    t),
    bottom: mixColour(a.bottom, b.bottom, t),
    ink:    mixColour(a.ink,    b.ink,    t),
    low:    mixColour(a.low,    b.low,    t),
    ground: mixColour(a.ground, b.ground, t),
    veil:   a.veil  + (b.veil  - a.veil)  * t,
    stars:  a.stars + (b.stars - a.stars) * t,
  };
}

// A few dozen stars at fixed positions (the same on every visit)
(function makeStars() {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let out = '';
  for (let i = 0; i < 34; i++) {
    const x = -190 + random() * 780;
    const y = 10 + random() * 78;
    const r = 0.8 + random() * 1.2;
    const delay = (random() * 4).toFixed(2);
    out += `<circle class="star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" style="animation-delay:-${delay}s"/>`;
  }
  starsEl.innerHTML = out;
})();

// Put the sun or moon on its arc. p goes from 0 (rising) to 1 (setting).
function placeInSky(element, p) {
  const x = 10 + p * 380;
  const y = 175 - 105 * Math.sin(Math.PI * p);
  element.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  element.setAttribute('opacity', Math.min(1, Math.max(0, Math.min(p, 1 - p) * 14)).toFixed(2));
}

let lastSkyKey = -1;

function drawSky(solarMinutes) {
  const key = Math.round(solarMinutes * 2);            // redraw twice a minute, no more
  if (key === lastSkyKey) return;
  lastSkyKey = key;

  const hour = solarMinutes / 60;
  const sky = skyAt(hour);

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--sky-top',    sky.top);
  rootStyle.setProperty('--sky-bottom', sky.bottom);
  rootStyle.setProperty('--ink',        sky.ink);
  rootStyle.setProperty('--ink-low',    sky.low);
  rootStyle.setProperty('--ground',     sky.ground);
  cityDim = 1 - sky.veil;                               // at night the cities fade into the dark sky
  starsEl.setAttribute('opacity', sky.stars.toFixed(2));

  // The sea gets darker with the night, in step with the cities fading
  const night = Math.min(1, sky.veil / 0.45);
  rootStyle.setProperty('--sea-back',  mixColour('#6fb1d1', '#1d3563', night));
  rootStyle.setProperty('--sea-front', mixColour('#3a86b0', '#12254a', night));

  // Sun from 06:00 to 18:00, moon from 18:00 to 06:00
  if (hour >= 6 && hour < 18) {
    placeInSky(sunEl, (hour - 6) / 12);
    moonEl.setAttribute('opacity', '0');
  } else {
    placeInSky(moonEl, (hour >= 18 ? hour - 18 : hour + 6) / 12);
    sunEl.setAttribute('opacity', '0');
  }
}

// 865 -> "14:25"
function formatClock(minutes) {
  const m = Math.floor(minutes) % 1440;
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

function frame() {
  const state = journeyAt(clockNow());

  if (state.leg.index !== shownLeg) showLeg(state.leg);
  drawSky(state.solarMinutes);
  drawCities(state.progress);

  // Meals and sleep: stand still, and stop the footsteps
  const resting = state.activity !== 'walking';
  if (body.classList.contains('resting') !== resting) {
    body.classList.toggle('resting', resting);
    scheduleNextStep();            // restart (or stop) the footstep timer
  }

  // Sleeping: the tent appears. Eating: his hand rises to his mouth with the local dish.
  const sleeping = state.activity === 'sleeping';
  const eating   = MEALS.includes(state.activity);
  const rowing = FORCE_ROW || state.from.mode === 'row';       // is this a sea leg?
  if (body.classList.contains('rowing') !== rowing) {
    body.classList.toggle('rowing', rowing);
    scheduleNextStep();                                         // footsteps and oar strokes follow different rhythms
  }
  body.classList.toggle('sleeping', sleeping);
  body.classList.toggle('eating', eating);

  let dishName = '';
  if (eating) {
    const dish = (state.progress < 0.5 ? state.from : state.to).dish;     // the dish of the nearer city
    dishName = dish.name;
    if (dish.name !== shownDish) {
      foodArt.innerHTML = dish.art;
      shownDish = dish.name;
    }
    // The dish gets smaller as the meal goes on
    foodArt.style.transform = `scale(${(0.62 * (1 - 0.85 * state.activityProgress)).toFixed(3)})`;
  }

  setText(hudClock, 'Solar time ' + formatClock(state.solarMinutes));

  setText(hudElapsed,   formatDuration(state.msOnRoad));
  setText(hudCountdown, formatDuration(state.msToArrival));
  setText(hudKm,        Math.round(state.totalKm).toLocaleString() + ' km');
  const toGo = Math.max(0, Math.round(state.leg.km - state.kmInLeg));
  setText(hudStatus,    (STATUS_TEXT[state.activity] || '') + (dishName ? ': ' + dishName : '') + '  \u00b7  ' + toGo + ' km to go');

  if (DEMO_ON) {
  const note = document.getElementById('demoNote');
  const hours = Math.round((getLeg(0).endMs - LAUNCH_MS) / 3600000);
  note.textContent = `Demo: ${hours} hours of the journey in ${DEMO_SECONDS} seconds`;
  note.hidden = false;
}

requestAnimationFrame(frame);
}

requestAnimationFrame(frame);


// ---------- Buttons ----------

startBtn.addEventListener('click', () => {
  setUpAudio();                       // must happen inside a tap, or the browser blocks sound
  body.classList.add('started');      // un-freezes the animations and hides the start screen
  if (demoStartedAt === null) demoStartedAt = performance.now();
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
  updateSea();                        // fade the sea in or out with the button
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
