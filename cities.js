// The Walking Man - the list of cities and the artwork for each one.
//
// Each city's picture is a small piece of SVG drawn in its own box that is
// 160 wide and 170 tall, with the ground at the bottom (y = 166).
// The page places that box on the left or right of the walking man and scales it.
//
// To add a city later: draw its art the same way and add one entry to CITIES.

// Helper: a row of battlement blocks ("merlons") along the top of a wall
function merlons(x0, x1, y, w = 7, gap = 5, h = 7) {
  let out = '';
  for (let x = x0; x + w <= x1; x += w + gap) {
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  }
  return out;
}

// ---------- Mumbai: the Gateway of India, with a few towers behind and the sea in front ----------
const MUMBAI_ART = `
  <g fill="#a9bccb">
    <rect x="4"   y="104" width="20" height="62"/>
    <rect x="26"  y="84"  width="14" height="82"/>
    <rect x="32"  y="60"  width="3"  height="24"/>
    <rect x="124" y="94"  width="16" height="72"/>
    <rect x="142" y="112" width="14" height="54"/>
  </g>
  <rect x="0" y="152" width="160" height="14" fill="#8fb3c9"/>
  <g fill="#7f98ab">
    <rect x="22"  y="108" width="20" height="58"/>
    <rect x="118" y="108" width="20" height="58"/>
    <rect x="40"  y="70"  width="80" height="96"/>
    <rect x="35"  y="62"  width="90" height="9"/>
    <rect x="43"  y="42"  width="11" height="22"/>
    <rect x="106" y="42"  width="11" height="22"/>
    <rect x="64"  y="48"  width="32" height="15"/>
    <path d="M43 42 a5.5 5.5 0 0 1 11 0Z"/>
    <path d="M106 42 a5.5 5.5 0 0 1 11 0Z"/>
    <path d="M72 48 a8 8 0 0 1 16 0Z"/>
  </g>
  <g fill="#3f5666">
    <path d="M64 166 V116 a16 16 0 0 1 32 0 V166Z"/>
    <path d="M27 166 V140 a5 5 0 0 1 10 0 V166Z"/>
    <path d="M123 166 V140 a5 5 0 0 1 10 0 V166Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// ---------- Pune: Shaniwar Wada, the fort with its great gate and corner bastions ----------
let puneDoorStuds = '';
for (const y of [134, 143, 152, 160]) {
  for (const x of [73, 80, 87]) {
    puneDoorStuds += `<circle cx="${x}" cy="${y}" r="1.5"/>`;
  }
}

const PUNE_ART = `
  <g fill="#7fa650">
    <circle cx="46"  cy="98" r="15"/>
    <circle cx="116" cy="96" r="16"/>
  </g>
  <g fill="#b9876a">
    <rect x="6" y="110" width="148" height="56"/>
    ${merlons(34, 126, 103)}
  </g>
  <g fill="#a8765a">
    <rect x="6"   y="84" width="26" height="82"/>
    <rect x="128" y="84" width="26" height="82"/>
    ${merlons(7, 31, 77, 5, 3)}
    ${merlons(129, 153, 77, 5, 3)}
  </g>
  <g fill="#9c6a4f">
    <rect x="54" y="58" width="52" height="108"/>
    ${merlons(55, 105, 51, 7, 4)}
  </g>
  <path d="M68 166 V124 Q80 96 92 124 V166Z" fill="#3a261b"/>
  <g fill="#d9b27c">${puneDoorStuds}</g>
  <path d="M76 92 V82 a4 4 0 0 1 8 0 V92Z" fill="#3a261b"/>
  <rect x="0" y="166" width="160" height="4" fill="#8b5f46"/>
`;

// ---------- The journey so far: just two cities for now ----------
// lon      : longitude in degrees (east is positive). Sets his local solar time: every 15 degrees is one hour.
// kmToNext : walking distance to the next city in the list. The last city leads back to the first.
// mode     : 'walk' (default) or 'row' for a sea crossing.
const CITIES = [
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 18.922, lon: 72.835, kmToNext: 150, art: MUMBAI_ART },
  { id: 'pune',   name: 'Pune',   country: 'India', lat: 18.520, lon: 73.855, kmToNext: 150, art: PUNE_ART },
];
