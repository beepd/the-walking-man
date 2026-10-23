// The route page. It uses the same clock-driven journey as the main page, so the dot on the map
// is exactly where the man is right now.
const SVGNS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const $ = id => document.getElementById(id);
const N = CITIES.length;

$('sphere').setAttribute('d', GEO.sphere);
$('land').setAttribute('d', GEO.land);

// ---------- map: one path per leg ----------
const legPaths = GEO.legs.map((g, i) => {
  const rowing = !!CITIES[i].mode;
  const p = el('path', { d: g.d, class: 'leg ahead' + (rowing ? ' sea' : '') }, $('legs'));
  return { p, rowing };
});

// ---------- map: dots and labels ----------
const dotEls = [];
CITIES.forEach((c, i) => {
  const [x, y] = GEO.cities[c.id];
  dotEls.push(el('circle', { cx: x, cy: y, r: 3.4 }, $('dots')));
});
// Names would crowd each other, so print one only if it is far enough from those already printed
const placed = [];
CITIES.forEach(c => {
  const [x, y] = GEO.cities[c.id];
  if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 34)) return;
  placed.push([x, y]);
  const t = el('text', { x: x + 6, y: y - 6 }, $('labels'));
  t.textContent = c.name;
});

// ---------- the list of stops ----------
const fmtDate = ms => new Date(ms).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
const stopEls = CITIES.map((c, i) => {
  const li = document.createElement('li');
  li.className = 'stop';
  const arrive = i === 0 ? LAUNCH_MS : getLeg(i - 1).endMs;       // arrival in this city (Mumbai: where he sets off)
  const toNext = c.kmToNext.toLocaleString() + ' km ' + (c.mode ? 'by rowing boat' : 'on foot') + ' to ' + CITIES[(i + 1) % N].name;
  li.innerHTML =
    '<span class="n">' + (i + 1) + ' / ' + N + '</span>' +
    '<h3></h3><div class="country"></div><div class="hello"></div>' +
    '<dl><dt>' + (i === 0 ? 'Sets off' : 'Arrives') + '</dt><dd></dd>' +
    '<dt>Local dish</dt><dd></dd><dt>Next</dt><dd></dd></dl><span class="tag"></span>';
  li.querySelector('h3').textContent = c.name;
  li.querySelector('.country').textContent = c.country;
  li.querySelector('.hello').textContent = '“' + c.hello + '”';
  const dd = li.querySelectorAll('dd');
  dd[0].textContent = fmtDate(arrive);
  dd[1].textContent = c.dish.name.charAt(0).toUpperCase() + c.dish.name.slice(1);
  dd[2].textContent = toNext;
  $('stops').appendChild(li);
  return li;
});

const lapMs = getLeg(N - 1).endMs - LAUNCH_MS;
$('lapDays').textContent = Math.round(lapMs / 86400000).toLocaleString();
$('lapKm').textContent = CITIES.reduce((s, c) => s + c.kmToNext, 0).toLocaleString();

// ---------- live update ----------
const fmtDur = ms => {
  const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60);
  return d ? d + 'd ' + h + 'h' : h + 'h ' + (m % 60) + 'm';
};

function update() {
  const now = Date.now();
  const me = $('me');
  if (now < LAUNCH_MS) {
    $('nowTitle').textContent = 'Setting off from ' + CITIES[0].name + ' in ' + fmtDur(LAUNCH_MS - now);
    $('nowSub').textContent = new Date(LAUNCH_MS).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' });
    return;
  }
  const s = journeyAt(now);
  const i = s.leg.index % N;
  const rowing = !!s.from.mode;
  const verbs = { walking: rowing ? 'Rowing' : 'Walking', sleeping: 'Sleeping', breakfast: 'Having breakfast', lunch: 'Having lunch', snack: 'Having a snack', dinner: 'Having dinner' };
  $('nowTitle').textContent = (verbs[s.activity] || 'On the road') + ': ' + s.from.name + ' → ' + s.to.name;
  $('nowSub').textContent = fmtDur(s.msToArrival) + ' until he reaches ' + s.to.name + ' · ' + Math.round(s.kmInLeg) + ' of ' + s.leg.km + ' km done on this stretch';
  $('nowBar').style.width = (s.progress * 100).toFixed(1) + '%';
  $('stDist').textContent = Math.round(s.totalKm).toLocaleString();
  $('stCities').textContent = s.leg.index;
  $('stDays').textContent = Math.floor(s.msOnRoad / 86400000) + 1;

  // map: legs of this lap that are finished, the one in progress, the rest
  legPaths.forEach(({ p, rowing }, k) => {
    const done = k < i, current = k === i;
    p.setAttribute('class', 'leg ' + (done || current ? 'done' : 'ahead') + (rowing ? ' sea' : ''));
    p.style.strokeDasharray = '';
    if (current && !rowing) { const len = p.getTotalLength(); p.style.strokeDasharray = (s.progress * len).toFixed(1) + ' ' + len.toFixed(1); }
  });
  dotEls.forEach((d, k) => d.setAttribute('class', k <= i ? 'done' : ''));
  const cur = legPaths[i].p;
  const pt = cur.getPointAtLength(s.progress * cur.getTotalLength());
  me.style.display = '';
  me.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');

  stopEls.forEach((li, k) => {
    const state = k < i + 1 ? (k === i ? 'here' : 'done') : '';
    li.className = 'stop ' + state;
    li.querySelector('.tag').textContent = k === i ? 'He left here · on the road now' : k <= i ? 'Visited' : k === (i + 1) % N ? 'Next stop' : 'Ahead';
  });
}
update();
setInterval(update, 1000);
