// The Walking Man - start screen, buttons, footstep sound, and the two cities.
//
// The footsteps are not audio files. We make them with the Web Audio API:
// a short burst of filtered noise (the scuff) plus a quick low thump (the weight).

const body     = document.body;
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

// ---------- Night on land: crickets and a crackling campfire ----------
// Like the footsteps, these are made on the spot. A chirp is three quick high pulses;
// a crackle is a tiny burst of filtered noise at random moments.
let night = null;

function playChirp(freq) {
  if (!audio || !soundOn) return;
  const t0 = audio.currentTime;
  const pan = audio.createStereoPanner();
  pan.pan.value = Math.random() * 0.8 - 0.4;
  pan.connect(audio.destination);
  for (let i = 0; i < 3; i++) {
    const t = t0 + i * 0.075;
    const osc = audio.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.012, t + 0.012);
    gain.gain.linearRampToValueAtTime(0, t + 0.04);
    osc.connect(gain).connect(pan);
    osc.start(t);
    osc.stop(t + 0.05);
  }
}

function playCrackle() {
  if (!audio || !soundOn) return;
  const now = audio.currentTime;
  const burst = audio.createBufferSource();
  burst.buffer = noise;
  const filter = audio.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1200 + Math.random() * 1800;
  const gain = audio.createGain();
  const peak = 0.015 + Math.random() * 0.03;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + Math.random() * 0.03);
  burst.connect(filter).connect(gain).connect(audio.destination);
  burst.start(now);
  burst.stop(now + 0.1);
}

// Run `action` again and again at slightly random gaps (in seconds) until the night ends
function nightLoop(action, minGap, maxGap) {
  const loop = { id: null };
  const go = () => {
    if (night) { action(); loop.id = setTimeout(go, (minGap + Math.random() * (maxGap - minGap)) * 1000); }
  };
  loop.id = setTimeout(go, Math.random() * 600);
  return loop;
}

function startNight() {
  if (night || !audio) return;
  night = { loops: [
    nightLoop(() => playChirp(4300), 1.0, 1.5),     // one cricket
    nightLoop(() => playChirp(4750), 1.4, 2.1),     // and another, a little higher and slower
    nightLoop(playCrackle, 0.15, 0.9),              // the fire
  ] };
}

function stopNight() {
  if (!night) return;
  night.loops.forEach(l => clearTimeout(l.id));
  night = null;
}

// Sea ambience should play only while rowing, with sound on, started, not paused, and the tab visible
function updateSea() {
  const wanted = body.classList.contains('rowing') && body.classList.contains('started') &&
                 !body.classList.contains('paused') && soundOn && !document.hidden;
  if (wanted) startSea(); else stopSea();

  const nightWanted = body.classList.contains('sleeping') && !body.classList.contains('rowing') && body.classList.contains('started') &&
                      soundOn && !document.hidden;
  if (nightWanted) startNight(); else stopNight();
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
let demoStartedAt = DEMO_ON ? performance.now() : null;   // the demo clock starts as soon as the page loads

function clockNow() {
  if (!DEMO_ON) return Date.now();
  const elapsed    = (performance.now() - demoStartedAt) % (DEMO_SECONDS * 1000);
  return LAUNCH_MS + elapsed * demoSpeedUp();
}

// The demo plays the whole first leg, plus a few seconds of the next one so the arrival can be seen to the end.
const DEMO_AFTER_SECONDS = 8;
function demoSpeedUp() {
  const firstLegMs = getLeg(0).endMs - LAUNCH_MS;
  return firstLegMs / ((DEMO_SECONDS - DEMO_AFTER_SECONDS) * 1000);   // journey milliseconds per real millisecond
}

// ---------- The arrival: how long each part lasts (in seconds of real time) ----------
//   welcome  : the locals come out and wave this long before he reaches the city
//   locFade  : how long they take to appear
//   slide    : the city slides past behind him (he walks through the town)
//   leave    : the locals keep waving this long after arrival, then fade away
//   cityFade : the next destination fades in on the right
// In the demo everything is shorter, and is sped up like the rest of the journey.
const BEATS_S = DEMO_ON ? { welcome: 9, locFade: 1.5, slide: 6, leave: 6, cityFade: 3 }
                        : { welcome: 90, locFade: 6, slide: 40, leave: 30, cityFade: 15 };
function beatMs(name) {
  return BEATS_S[name] * 1000 * (DEMO_ON ? demoSpeedUp() : 1);
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
const capNow   = document.getElementById('capNow');

// The line under the picture that tells a newcomer what he is doing right now
const TOTAL_DAYS = Math.round((getLeg(CITIES.length - 1).endMs - LAUNCH_MS) / 86400000);
function captionNow(state, rowing, dishName) {
  const from = state.from.name, to = state.to.name;

  // Which lap of the world, and which day of that lap (he goes round again after Dubai -> Mumbai -> Pune)
  const lap      = Math.floor(state.leg.index / CITIES.length);
  const lapStart = lap === 0 ? LAUNCH_MS : getLeg(lap * CITIES.length - 1).endMs;
  const nowMs    = LAUNCH_MS + state.msOnRoad;
  const dayInLap = Math.min(TOTAL_DAYS, Math.floor((nowMs - lapStart) / 86400000) + 1);
  const day = (lap > 0 ? 'Lap ' + (lap + 1) + ' \u00b7 ' : '') + 'Day ' + dayInLap + ' of about ' + TOTAL_DAYS.toLocaleString() +
              ' \u00b7 ' + CITIES.length + ' cities';
  const trip = from + ' to ' + to;
  let doing;
  switch (state.activity) {
    case 'waiting':  doing = 'He sets off from ' + from + ' on ' + new Date(LAUNCH_MS).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }); break;
    case 'sleeping': doing = 'Sleeping: it is night where he is'; break;
    case 'walking':  doing = (rowing ? 'Rowing from ' : 'Walking from ') + trip; break;
    default:         doing = 'Meal break' + (dishName ? ': ' + dishName : '') + ' \u00b7 ' + trip;
  }
  return doing + '  \u00b7  ' + day;
}
const starsEl  = document.getElementById('stars');
const sunEl    = document.getElementById('sun');
const moonEl   = document.getElementById('moon');
const foodArt  = document.getElementById('foodArt');

let shownLeg = -1;         // which leg the pictures currently show
let shownDish = '';        // which dish is drawn in his hand

const localsLeft  = document.getElementById('localsLeft');
const localsRight = document.getElementById('localsRight');

// ---------- The welcome crowd ----------
// Drawn in the same 160 x 170 box as the city, so it grows and shrinks with it.
const LOCAL_LOOKS = [
  { shirt: '#d9534f', skin: '#c68642', hair: '#1f1a17' },
  { shirt: '#3b8ea5', skin: '#e0ac69', hair: '#2b1d14' },
  { shirt: '#f0b429', skin: '#8d5524', hair: '#111111' },
  { shirt: '#7a5ea8', skin: '#f1c27d', hair: '#4a2f1b' },
  { shirt: '#4f9d69', skin: '#a9743f', hair: '#1b1b1b' },
];

function personArt(x, height, look, delay) {
  const s = height / 100;
  return `<g transform="translate(${x} 166) scale(${s.toFixed(3)})">
    <rect x="-8" y="-46" width="6" height="46" rx="3" fill="#33425b"/>
    <rect x="2"  y="-46" width="6" height="46" rx="3" fill="#33425b"/>
    <rect x="-16" y="-80" width="5" height="28" rx="2.5" fill="${look.skin}"/>
    <path d="M-11 -48 Q-12 -80 -6 -84 H6 Q12 -80 11 -48 Z" fill="${look.shirt}"/>
    <g class="wave" style="animation-delay:-${delay}s"><rect x="9" y="-112" width="5" height="30" rx="2.5" fill="${look.skin}"/></g>
    <rect x="-3" y="-90" width="6" height="8" fill="${look.skin}"/>
    <circle cx="0" cy="-98" r="10" fill="${look.skin}"/>
    <path d="M-10.5 -98 Q-10 -110 0 -110 Q10 -110 10.5 -98 Q4 -103 -10.5 -98Z" fill="${look.hair}"/>
  </g>`;
}

function bubbleArt(x, tailY, lines) {
  const w = Math.max(...lines.map(l => l.length)) * 5 + 10;
  const h = lines.length * 11 + 5;
  const top = tailY - h;
  // drawn a little smaller (0.85) around the bubble's tail, so it stays clear of the numbers at the top
  return `<g class="bubble" transform="translate(${x} ${tailY}) scale(0.85) translate(${-x} ${-tailY})"><rect x="${(x - w / 2).toFixed(1)}" y="${top}" width="${w}" height="${h}" rx="5"/>
    <path d="M${x - 3} ${tailY - 1} L${x + 3} ${tailY - 1} L${x} ${tailY + 6}Z"/>` +
    lines.map((l, i) => `<text x="${x}" y="${top + 10 + i * 11}">${l}</text>`).join('') + '</g>';
}

// mode 'welcome': locals greet him in their own language.  mode 'bye': they see him off at the very start.
function crowdArt(city, mode) {
  const people = [[4, 52, 0, 0.0], [26, 85, 1, 0.3], [50, 78, 2, 0.6], [96, 88, 3, 0.15], [120, 54, 4, 0.45]];
  const art = people.map(p => personArt(p[0], p[1], LOCAL_LOOKS[p[2]], p[3])).join('');
  const first  = mode === 'welcome' ? [city.hello] : ['Safe travels!'];
  const second = mode === 'welcome' ? ['Welcome to', city.name + '!'] : ['Come back soon!'];
  return art + bubbleArt(26, 66, first) + bubbleArt(90, 62, second);
}

// A wooden pier in the city's 160 x 170 box: it reaches out to both sides, with posts down into the water
let pierPosts = '';
for (let x = -70; x <= 230; x += 20) pierPosts += `<rect x="${x}" y="164" width="4" height="14"/>`;
const PIER_ART = `<g fill="#6b4a2a">${pierPosts}</g>
  <rect x="-80" y="161" width="320" height="5" fill="#8a6a3e"/>
  <g stroke="#6b4a2a" stroke-width="0.8"><path d="M-60 161 V166 M-30 161 V166 M0 161 V166 M30 161 V166 M60 161 V166 M90 161 V166 M120 161 V166 M150 161 V166 M180 161 V166 M210 161 V166"/></g>`;

function showLeg(leg) {
  // Sea legs: a wooden pier under the city he rows away from, and under the city he rows to
  const prev = leg.index > 0 ? CITIES[(leg.index - 1) % CITIES.length] : null;
  const pierLeft  = leg.from.mode === 'row' || (prev && prev.mode === 'row');   // also just after arriving by sea
  const pierRight = leg.from.mode === 'row';
  cityLeft.innerHTML   = (pierLeft  ? PIER_ART : '') + leg.from.art;
  cityRight.innerHTML  = (pierRight ? PIER_ART : '') + leg.to.art;
  localsLeft.innerHTML  = crowdArt(leg.from, leg.index === 0 ? 'bye' : 'welcome');   // the crowd that just welcomed him stays
  localsRight.innerHTML = crowdArt(leg.to, 'welcome');
  labelLeft.textContent  = leg.from.name;
  labelRight.textContent = leg.to.name;
  hudNextLabel.textContent = 'Next stop: ' + leg.to.name;
  bigLeft  = bigScaleFor(cityLeft);
  bigRight = bigScaleFor(cityRight);
  shownLeg = leg.index;
}

// How big a city gets on arrival: its drawn height ends up about 235 units, taller than he is (about 205).
// Short drawings are scaled up more, but never beyond 1.9 x or below 1.4 x.
let bigLeft = 1.5, bigRight = 1.5;
function bigScaleFor(group) {
  try {
    const h = 166 - group.getBBox().y;
    return h > 20 ? Math.min(1.9, Math.max(1.4, 235 / h)) : 1.5;
  } catch (e) { return 1.5; }
}

let cityDim = 1;           // 1 in daylight, lower at night (set by drawSky)

// The destination city grows until it is bigger than he is (1.4 x), then slides past behind him
// and becomes the city he has left. Positions are the centre of each city, in scene units.
const CITY_SMALL = 0.35, GROUND_Y = 258;
const FAR_RIGHT = 510, NEAR_RIGHT = 440, NEAR_LEFT = -70, FAR_LEFT = -110;   // city centres, in scene units
const lerp   = (a, b, t) => a + (b - a) * t;
const smooth = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };

function placeCity(group, locals, label, cx, scale, opacity, localsOpacity) {
  const t = `translate(${cx.toFixed(1)} ${GROUND_Y}) scale(${scale.toFixed(3)}) translate(-80 -170)`;
  group.setAttribute('transform', t);
  locals.setAttribute('transform', t);
  group.style.opacity  = opacity;
  locals.style.opacity = localsOpacity;
  label.setAttribute('x', cx.toFixed(1));
}

// progress goes from 0 (just left) to 1 (arrived). msToArrival and msSinceStart drive the welcome.
function drawCities(progress, msToArrival, msSinceStart, legIndex) {
  let scaleL = bigLeft - (bigLeft - CITY_SMALL) * progress;
  let scaleR = CITY_SMALL + (bigRight - CITY_SMALL) * progress;
  let cxL = lerp(NEAR_LEFT, FAR_LEFT, progress);
  let cxR = lerp(FAR_RIGHT, NEAR_RIGHT, progress);

  // The last stretch: the city slides left, behind him
  let bubbleVisible = 1;
  const slideLen = beatMs('slide');
  if (msToArrival < slideLen) {
    const e = smooth(1 - msToArrival / slideLen);
    cxR    = lerp(NEAR_RIGHT, NEAR_LEFT, e);
    scaleR = bigRight;
    cxL    = lerp(cxL, -520, e);
    // The speech bubbles melt away while the town passes the countdown in the middle, and return on the left
    bubbleVisible = e < 0.75 ? 1 - smooth(e / 0.2) : smooth((e - 0.75) / 0.25);
  }
  localsRight.style.setProperty('--bubble', bubbleVisible.toFixed(2));

  // The crowd waves from shortly before he arrives, and for a while after
  const welcome  = msToArrival < beatMs('welcome') ? smooth((beatMs('welcome') - msToArrival) / beatMs('locFade')) : 0;
  const farewell = 1 - smooth(msSinceStart / beatMs('leave'));
  const nextFade = legIndex > 0 ? smooth(msSinceStart / beatMs('cityFade')) : 1;   // the next destination fades in

  placeCity(cityLeft,  localsLeft,  labelLeft,  cxL, scaleL, (1 - 0.4 * progress) * cityDim, farewell * cityDim);
  placeCity(cityRight, localsRight, labelRight, cxR, scaleR, (0.6 + 0.4 * progress) * cityDim * nextFade, welcome * cityDim);
  labelRight.style.opacity = nextFade;
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

// How bright a colour looks (0 black ... 1 white), and which text colour contrasts best with it
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const INK_DARK = '#2b2f36', INK_LIGHT = '#f4efe3';
function readableOn(background) {
  const L = luminance(background);
  const contrastDark  = (L + 0.05) / (luminance(INK_DARK) + 0.05);
  const contrastLight = (luminance(INK_LIGHT) + 0.05) / (L + 0.05);
  return contrastDark >= contrastLight ? INK_DARK : INK_LIGHT;
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
  // Text colour: whichever of dark or light reads better against the sky right now (blending the two
  // would pass through a grey that vanishes against the dusk and dawn colours)
  rootStyle.setProperty('--ink',        readableOn(sky.top));
  rootStyle.setProperty('--ink-low',    readableOn(sky.bottom));
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
  const now   = clockNow();
  const state = journeyAt(now);

  if (state.leg.index !== shownLeg) showLeg(state.leg);
  drawSky(state.solarMinutes);
  drawCities(state.progress, state.msToArrival, Math.max(0, now - state.leg.startMs), state.leg.index);

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
  if (body.classList.contains('sleeping') !== sleeping) {
    body.classList.toggle('sleeping', sleeping);
    updateSea();                                                // start or stop the night sounds
  }
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

  setText(hudClock, 'Time where he is: ' + formatClock(state.solarMinutes));
  setText(capNow, captionNow(state, rowing, dishName));

  setText(hudElapsed,   formatDuration(state.msOnRoad));
  // Before the launch the big countdown is the time until he sets off, not the time to Pune
  const waiting = state.activity === 'waiting';
  setText(hudNextLabel, waiting ? 'Setting off from ' + state.from.name + ' in' : 'Next stop: ' + state.to.name);
  setText(hudCountdown, formatDuration(waiting ? LAUNCH_MS - now : state.msToArrival));
  setText(hudKm,        Math.round(state.totalKm).toLocaleString() + ' km');
  const toGo = Math.max(0, Math.round(state.leg.km - state.kmInLeg));
  setText(hudStatus,    ((state.activity === 'walking' && rowing) ? 'Rowing' : (STATUS_TEXT[state.activity] || '')) + (dishName ? ': ' + dishName : '') + '  \u00b7  ' + toGo + ' km to go');

  if (DEMO_ON) {
  const note = document.getElementById('demoNote');
  const hours = Math.round(demoSpeedUp() * DEMO_SECONDS * 1000 / 3600000);
  note.textContent = `Demo: ${hours} hours of the journey in ${DEMO_SECONDS} seconds`;
  note.hidden = false;
}

requestAnimationFrame(frame);
}

requestAnimationFrame(frame);


// ---------- Buttons ----------

// Browsers only allow sound after a tap, so the page starts silent and the first tap anywhere turns it on.
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  setUpAudio();                       // must happen inside a tap, or the browser blocks sound
  soundBtn.textContent = soundOn ? 'Sound: on' : 'Sound: off';
  goFullscreenOnPhones();
  scheduleNextStep();
  updateSea();
}
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('#sound')) unlockAudio();     // the sound button handles its own first tap
});
document.addEventListener('keydown', unlockAudio);

soundBtn.addEventListener('click', () => {
  if (!audioUnlocked) { unlockAudio(); return; }      // the first tap only switches the sound on
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
