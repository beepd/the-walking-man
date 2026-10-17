// The Walking Man - the journey clock.
//
// Nothing here is stored on a server. The whole journey is a pure function of the clock:
//     journeyAt(now)  ->  where is he, what is he doing, how far along is he?
// Everyone who opens the page at the same moment gets the same answer.
//
// How it works:
//   1. LAUNCH_MS is the moment the walk began.
//   2. He walks from city to city in the order of the CITIES list (and loops back to the start).
//   3. Each day follows a fixed routine in LOCAL SOLAR TIME at the city he left:
//      walk, breakfast, walk, lunch, walk, snack, walk, dinner, walk, sleep.
//      Only the "walking" parts move him forward.
//   4. We work out the time he arrives at each city, and from that everything else.

// The moment the walk begins: Mumbai, Sunday 18 October 2026, 9:00 AM India time.
const LAUNCH_MS = Date.parse('2026-10-18T09:00:00+05:30');

const WALK_KMH = 5;      // walking speed
const ROW_KMH  = 3.5;    // rowing speed (used once we add the sea crossings)


// ---------- The daily routine ----------
// Durations in minutes. The day starts at 06:00 local solar time and adds up to 24 hours.
const DAY = [
  { name: 'walking',   min: 120 },   // 06:00 - 08:00
  { name: 'breakfast', min: 30  },   // 08:00 - 08:30
  { name: 'walking',   min: 240 },   // 08:30 - 12:30
  { name: 'lunch',     min: 45  },   // 12:30 - 13:15
  { name: 'walking',   min: 195 },   // 13:15 - 16:30
  { name: 'snack',     min: 20  },   // 16:30 - 16:50
  { name: 'walking',   min: 160 },   // 16:50 - 19:30
  { name: 'dinner',    min: 45  },   // 19:30 - 20:15
  { name: 'walking',   min: 105 },   // 20:15 - 22:00
  { name: 'sleeping',  min: 480 },   // 22:00 - 06:00
];

const DAY_MIN  = 1440;
const WALK_PER_DAY = DAY.filter(s => s.name === 'walking').reduce((sum, s) => sum + s.min, 0);   // 820

// How many minutes of walking he has done by minute y of the routine (y counts from 06:00; can be any size)
function walkedBy(y) {
  const days = Math.floor(y / DAY_MIN);
  let r = y - days * DAY_MIN;
  let total = days * WALK_PER_DAY;
  for (const seg of DAY) {
    if (r <= 0) break;
    const used = Math.min(r, seg.min);
    if (seg.name === 'walking') total += used;
    r -= used;
  }
  return total;
}

// The reverse: at which minute y has he walked a total of c minutes? (the earliest such moment)
function minuteWhenWalked(c) {
  const days = Math.ceil(c / WALK_PER_DAY) - 1;
  let r = c - days * WALK_PER_DAY;                     // 0 < r <= 820 : walking left to do on that day
  let y = days * DAY_MIN;
  for (const seg of DAY) {
    if (seg.name === 'walking') {
      if (r <= seg.min) return y + r;
      r -= seg.min;
    }
    y += seg.min;
  }
  return y;
}

// What is he doing at minute y of the routine, and how far through that activity is he (0 to 1)?
function activityInfoAt(y) {
  let r = ((y % DAY_MIN) + DAY_MIN) % DAY_MIN;
  for (const seg of DAY) {
    if (r < seg.min) return { name: seg.name, progress: r / seg.min };
    r -= seg.min;
  }
  return { name: 'walking', progress: 0 };
}

function activityAt(y) {
  return activityInfoAt(y).name;
}


// ---------- Time and place ----------
// Local solar time is just UTC shifted by the longitude: every 15 degrees east is one hour later.
// "y" is minutes since 06:00 local solar time on that clock.
function routineMinute(ms, city) {
  return ms / 60000 + city.lon * 4 - 360;
}
function msFromRoutineMinute(y, city) {
  return (y + 360 - city.lon * 4) * 60000;
}

function kmPerMinute(city) {
  return (city.mode === 'row' ? ROW_KMH : WALK_KMH) / 60;
}


// ---------- The legs (one leg = one city to the next) ----------
// Built on demand and remembered, so we only calculate each one once.
const legs = [];

function getLeg(i) {
  while (legs.length <= i) {
    const n    = legs.length;
    const from = CITIES[n % CITIES.length];
    const to   = CITIES[(n + 1) % CITIES.length];
    const prev = legs[n - 1];

    const startMs     = prev ? prev.endMs : LAUNCH_MS;
    const startKm     = prev ? prev.startKm + prev.km : 0;
    const walkMinutes = from.kmToNext / kmPerMinute(from);       // minutes of actual walking this leg needs
    const startWalked = walkedBy(routineMinute(startMs, from));
    const endMs       = msFromRoutineMinute(minuteWhenWalked(startWalked + walkMinutes), from);

    legs.push({ index: n, from, to, km: from.kmToNext, startMs, endMs, startKm, startWalked, walkMinutes });
  }
  return legs[i];
}

// Everything the page needs to know about the moment `nowMs`
function journeyAt(nowMs) {
  if (nowMs < LAUNCH_MS) {
    const leg = getLeg(0);
    const y = routineMinute(nowMs, leg.from);
    return { leg, from: leg.from, to: leg.to, progress: 0, activity: 'waiting', activityProgress: 0,
             solarMinutes: ((y + 360) % DAY_MIN + DAY_MIN) % DAY_MIN, kmInLeg: 0,
             totalKm: 0, msToArrival: leg.endMs - nowMs, msOnRoad: 0 };
  }

  let i = 0;
  while (getLeg(i).endMs <= nowMs) i++;                 // find the leg we are in
  const leg = getLeg(i);

  const y        = routineMinute(nowMs, leg.from);
  const walked   = walkedBy(y) - leg.startWalked;
  const progress = Math.min(1, Math.max(0, walked / leg.walkMinutes));
  const kmInLeg  = progress * leg.km;
  const info     = activityInfoAt(y);

  return {
    leg, from: leg.from, to: leg.to,
    progress,
    activity: info.name,                                // 'walking', 'lunch', 'sleeping', ...
    activityProgress: info.progress,                    // how far through the meal or sleep (0 to 1)
    solarMinutes: ((y + 360) % DAY_MIN + DAY_MIN) % DAY_MIN,   // local solar time as minutes after midnight
    kmInLeg,
    totalKm: leg.startKm + kmInLeg,
    msToArrival: leg.endMs - nowMs,
    msOnRoad: nowMs - LAUNCH_MS,
  };
}

// So the file can also be tested outside the browser
if (typeof module !== 'undefined') {
  module.exports = { journeyAt, getLeg, walkedBy, minuteWhenWalked, activityAt, activityInfoAt, LAUNCH_MS, WALK_PER_DAY, DAY };
}
