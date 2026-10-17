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

// ---------- Signature dishes ----------
// Small pictures centred on (0, 0), about 40 units wide. He eats the dish of the city he is closest to.

// Mumbai: vada pav (a spiced potato fritter in a soft bun, with a green chilli)
const VADA_PAV_ART = `
  <ellipse cx="0" cy="8" rx="17" ry="7" fill="#d9a05b"/>
  <ellipse cx="0" cy="2" rx="11" ry="7" fill="#d98c2b"/>
  <path d="M-17 -1 Q0 -26 17 -1 Z" fill="#efc07a"/>
  <path d="M-8 -9 Q0 -14 8 -9" fill="none" stroke="#f8dba5" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 6 q10 -2 14 4" fill="none" stroke="#4f8a3a" stroke-width="3" stroke-linecap="round"/>
`;

// Pune: misal pav (a spicy sprouts curry topped with crunchy farsan, with a lemon wedge)
const MISAL_PAV_ART = `
  <path d="M-17 -2 H17 Q15 15 0 15 Q-15 15 -17 -2 Z" fill="#f1e7d6"/>
  <ellipse cx="0" cy="-2" rx="17" ry="5.5" fill="#c0392b"/>
  <g fill="#f2c14e">
    <circle cx="-8" cy="-4" r="1.8"/><circle cx="-2" cy="-6" r="1.8"/><circle cx="5" cy="-5" r="1.8"/>
    <circle cx="9" cy="-2" r="1.6"/><circle cx="1" cy="-2" r="1.8"/><circle cx="-11" cy="-1" r="1.5"/>
  </g>
  <g fill="#4f8a3a"><circle cx="-5" cy="-5" r="1.1"/><circle cx="3" cy="-7" r="1.1"/><circle cx="7" cy="-6" r="1.1"/></g>
  <path d="M10 -8 a6 6 0 0 1 7 6 Z" fill="#f4d03f"/>
`;

// ---------- More dish pictures (simple, reusable shapes) ----------
const dishBowl  = (soup, top = '#f2c14e', rim = '#f1e7d6') => `
  <path d="M-17 -2 H17 Q15 15 0 15 Q-15 15 -17 -2 Z" fill="${rim}"/>
  <ellipse cx="0" cy="-2" rx="17" ry="5.5" fill="${soup}"/>
  <g fill="${top}"><circle cx="-7" cy="-4" r="2"/><circle cx="1" cy="-5" r="2"/><circle cx="8" cy="-3" r="2"/></g>`;
const dishPlate = (food, side = '#8fbf5a') => `
  <ellipse cx="0" cy="8" rx="19" ry="6" fill="#f1e7d6"/>
  <ellipse cx="0" cy="5" rx="13" ry="6" fill="${food}"/>
  <ellipse cx="-4" cy="3" rx="5" ry="2.5" fill="${side}"/>
  <path d="M10 2 a5 5 0 0 1 6 5 Z" fill="#a8cf4a"/>`;
const dishRoll = (wrap = '#e8c27a', filling = '#c0392b') => `
  <rect x="-16" y="-6" width="32" height="13" rx="6.5" fill="${wrap}"/>
  <ellipse cx="16" cy="0.5" rx="3" ry="6" fill="${filling}"/>
  <path d="M-16 2 H8 L4 12 H-12 Z" fill="#cfd5d9"/>`;

// ---------- A stand-in skyline for cities whose picture is not drawn yet ----------
function placeholderArt(seed) {
  let s = seed, out = '<g fill="#a9bccb">';
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let x = 8; x < 148; x += 22) {
    const h = 40 + rnd() * 80;
    out += `<rect x="${x}" y="${166 - h}" width="18" height="${h}"/>`;
  }
  return out + '</g><rect x="0" y="166" width="160" height="4" fill="#6a8296"/>';
}

// ---------- Batch 1 of the pictures ----------
// Hyderabad: Charminar, four minarets around a square arch
const HYDERABAD_ART = `
  <g fill="#cdb998">
    <rect x="30" y="86" width="100" height="80"/>
    <rect x="22" y="44" width="14" height="122"/>
    <rect x="124" y="44" width="14" height="122"/>
    <rect x="50" y="58" width="60" height="30"/>
  </g>
  <g fill="#b39f7e">
    <rect x="19" y="82" width="20" height="6"/><rect x="121" y="82" width="20" height="6"/>
    <rect x="19" y="62" width="20" height="4"/><rect x="121" y="62" width="20" height="4"/>
    <rect x="30" y="86" width="100" height="5"/>
  </g>
  <g fill="#8e7a5c">
    <path d="M23 44 a6 6 0 0 1 12 0Z"/><path d="M125 44 a6 6 0 0 1 12 0Z"/>
    <path d="M53 58 a5 5 0 0 1 10 0Z"/><path d="M97 58 a5 5 0 0 1 10 0Z"/>
    <path d="M72 58 a8 8 0 0 1 16 0Z"/>
    <rect x="28" y="34" width="2" height="10"/><rect x="130" y="34" width="2" height="10"/>
  </g>
  <g fill="#4a3d2f">
    <path d="M62 166 V118 a18 18 0 0 1 36 0 V166Z"/>
    <path d="M35 166 V124 a5 5 0 0 1 10 0 V166Z"/><path d="M115 166 V124 a5 5 0 0 1 10 0 V166Z"/>
    <path d="M60 96 V90 a4 4 0 0 1 8 0 V96Z"/><path d="M92 96 V90 a4 4 0 0 1 8 0 V96Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#8e7a5c"/>
`;

// Kolkata: Howrah Bridge, a great steel cantilever over the river
let howrahTruss = '';
for (let x = 20; x < 140; x += 10) howrahTruss += `<path d="M${x} 126 L${x + 5} 108 L${x + 10} 126"/>`;
const KOLKATA_ART = `
  <rect x="0" y="146" width="160" height="20" fill="#8fa9b8"/>
  <g fill="#5b6670">
    <rect x="24" y="128" width="12" height="20"/><rect x="124" y="128" width="12" height="20"/>
  </g>
  <g fill="none" stroke="#4d5963" stroke-width="3" stroke-linejoin="round">
    <path d="M22 128 L34 36 L46 128"/><path d="M114 128 L126 36 L138 128"/>
    <path d="M34 36 L4 126"/><path d="M126 36 L156 126"/>
    <path d="M34 36 Q80 82 126 36"/>
    <path d="M30 70 H40 M28 92 H44 M120 70 H132 M118 92 H134"/>
  </g>
  <g fill="none" stroke="#5b6670" stroke-width="2">${howrahTruss}</g>
  <rect x="0" y="126" width="160" height="6" fill="#3f4a53"/>
  <g fill="#a9bccb"><rect x="0" y="136" width="14" height="30" opacity="0"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Dhaka: Ahsan Manzil, the pink palace on the river
const DHAKA_ART = `
  <g fill="#d98a9a">
    <rect x="10" y="102" width="140" height="64"/>
    <rect x="52" y="84" width="56" height="82"/>
    <rect x="62" y="64" width="36" height="24"/>
  </g>
  <g fill="#c4707f">
    <rect x="6" y="98" width="148" height="6"/>
    <rect x="48" y="80" width="64" height="6"/>
    <rect x="58" y="60" width="44" height="5"/>
  </g>
  <g fill="#ece4d6">
    <path d="M66 62 a14 14 0 0 1 28 0Z"/>
    <rect x="79" y="36" width="2" height="12"/>
    <path d="M30 98 a5 5 0 0 1 10 0Z"/><path d="M120 98 a5 5 0 0 1 10 0Z"/>
  </g>
  <g fill="#6b3a45">
    <path d="M70 166 V128 a10 10 0 0 1 20 0 V166Z"/>
    <path d="M18 166 V126 a5 5 0 0 1 10 0 V166Z"/><path d="M36 166 V126 a5 5 0 0 1 10 0 V166Z"/>
    <path d="M114 166 V126 a5 5 0 0 1 10 0 V166Z"/><path d="M132 166 V126 a5 5 0 0 1 10 0 V166Z"/>
    <path d="M72 82 V74 a4 4 0 0 1 8 0 V82Z"/><path d="M82 82 V74 a4 4 0 0 1 8 0 V82Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#a45f6d"/>
`;

// Yangon: Shwedagon Pagoda, the golden stupa
const YANGON_ART = `
  <g fill="#e6bc4a">
    <rect x="24" y="136" width="112" height="30"/>
    <rect x="38" y="122" width="84" height="16"/>
    <path d="M48 122 Q50 82 80 70 Q110 82 112 122Z"/>
    <path d="M80 72 L72 46 H88Z"/>
  </g>
  <g fill="#c99a2a">
    <rect x="52" y="112" width="56" height="4"/>
    <rect x="62" y="96" width="36" height="3"/>
    <rect x="68" y="84" width="24" height="3"/>
    <rect x="73" y="64" width="14" height="3"/><rect x="75" y="54" width="10" height="3"/>
    <rect x="38" y="134" width="84" height="3"/>
  </g>
  <path d="M80 48 V22" stroke="#e6bc4a" stroke-width="3"/>
  <path d="M74 32 H86 L80 18Z" fill="#f3d675"/>
  <g fill="#e6bc4a">
    <path d="M8 166 V148 Q12 134 16 148 V166Z"/><path d="M144 166 V148 Q148 134 152 148 V166Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#b8892a"/>
`;

// Bangkok: Wat Arun, the temple of dawn with its tall prang
const BANGKOK_ART = `
  <g fill="#e9e4d8">
    <path d="M70 166 L72 120 L76 70 Q80 34 84 70 L88 120 L90 166Z"/>
    <path d="M34 166 L36 130 Q42 100 48 130 L50 166Z"/>
    <path d="M110 166 L112 130 Q118 100 124 130 L126 166Z"/>
    <rect x="56" y="140" width="48" height="26"/>
  </g>
  <g fill="#c9bfa8">
    <rect x="68" y="136" width="24" height="4"/><rect x="71" y="112" width="18" height="4"/>
    <rect x="74" y="88" width="12" height="4"/><rect x="76" y="68" width="8" height="3"/>
    <rect x="54" y="140" width="52" height="4"/>
  </g>
  <g fill="#5e8f9c">
    <circle cx="80" cy="128" r="3"/><circle cx="80" cy="104" r="2.5"/><circle cx="80" cy="80" r="2"/>
    <circle cx="42" cy="136" r="2"/><circle cx="118" cy="136" r="2"/>
  </g>
  <path d="M80 56 V20" stroke="#c9a23a" stroke-width="2"/>
  <path d="M75 26 H85 L80 14Z" fill="#c9a23a"/>
  <g fill="#7a6a58"><path d="M72 166 V152 a8 8 0 0 1 16 0 V166Z"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#a39a85"/>
`;

// ---------- The whole route ----------
// lon      : longitude in degrees (east is positive). Sets his local solar time: every 15 degrees is one hour.
// kmToNext : worked out below from the coordinates (walking road is about 20% longer than a straight line).
// mode     : 'walk' (default) or 'row' for a sea crossing (rowed in a straight line over the water).
// art      : the city picture. Cities without a drawn picture yet get a stand-in skyline.
// dish     : the local food he eats at mealtimes (name and a small picture).
const CITIES = [
  { id: 'mumbai',      name: 'Mumbai',       country: 'India',        lat: 18.922, lon: 72.835,   art: MUMBAI_ART,    dish: { name: 'vada pav',   art: VADA_PAV_ART } },
  { id: 'pune',        name: 'Pune',         country: 'India',        lat: 18.520, lon: 73.855,   art: PUNE_ART,      dish: { name: 'misal pav',  art: MISAL_PAV_ART } },
  { id: 'hyderabad',   name: 'Hyderabad',    country: 'India',        lat: 17.385, lon: 78.487,   art: HYDERABAD_ART, dish: { name: 'biryani',    art: dishBowl('#e3a73c', '#7a4a22') } },
  { id: 'kolkata',     name: 'Kolkata',      country: 'India',        lat: 22.572, lon: 88.364,   art: KOLKATA_ART,   dish: { name: 'kathi roll', art: dishRoll() } },
  { id: 'dhaka',       name: 'Dhaka',        country: 'Bangladesh',   lat: 23.810, lon: 90.412,   art: DHAKA_ART,     dish: { name: 'hilsa curry', art: dishBowl('#d8742c', '#f0e0c0') } },
  { id: 'yangon',      name: 'Yangon',       country: 'Myanmar',      lat: 16.841, lon: 96.173,   art: YANGON_ART,    dish: { name: 'mohinga',    art: dishBowl('#e0b657', '#8fbf5a') } },
  { id: 'bangkok',     name: 'Bangkok',      country: 'Thailand',     lat: 13.756, lon: 100.502,  art: BANGKOK_ART,   dish: { name: 'pad thai',   art: dishPlate('#e8a23a') } },
  { id: 'phnompenh',   name: 'Phnom Penh',   country: 'Cambodia',     lat: 11.556, lon: 104.928,  dish: { name: 'fish amok',  art: dishBowl('#e9b44c', '#4f8a3a') } },
  { id: 'hanoi',       name: 'Hanoi',        country: 'Vietnam',      lat: 21.028, lon: 105.854,  dish: { name: 'pho',        art: dishBowl('#d9b77a', '#4f8a3a') } },
  { id: 'beijing',     name: 'Beijing',      country: 'China',        lat: 39.904, lon: 116.407,  dish: { name: 'dumplings',  art: dishPlate('#f1e7d6', '#c0392b') } },
  { id: 'seoul',       name: 'Seoul',        country: 'South Korea',  lat: 37.566, lon: 126.978,  dish: { name: 'bibimbap',   art: dishBowl('#f1e7d6', '#c0392b') } },
  { id: 'tokyo',       name: 'Tokyo',        country: 'Japan',        lat: 35.676, lon: 139.650,  mode: 'row', dish: { name: 'sushi', art: dishPlate('#f1e7d6', '#e8795a') } },
  { id: 'vancouver',   name: 'Vancouver',    country: 'Canada',       lat: 49.283, lon: -123.121, dish: { name: 'salmon',     art: dishPlate('#e8795a', '#8fbf5a') } },
  { id: 'losangeles',  name: 'Los Angeles',  country: 'USA',          lat: 34.052, lon: -118.244, dish: { name: 'fish tacos', art: dishPlate('#e8c27a', '#4f8a3a') } },
  { id: 'mexicocity',  name: 'Mexico City',  country: 'Mexico',       lat: 19.433, lon: -99.133,  dish: { name: 'tacos al pastor', art: dishPlate('#e0a43a', '#c0392b') } },
  { id: 'panama',      name: 'Panama City',  country: 'Panama',       lat: 8.983,  lon: -79.517,  dish: { name: 'sancocho',   art: dishBowl('#d9b45a', '#4f8a3a') } },
  { id: 'bogota',      name: 'Bogotá',  country: 'Colombia',     lat: 4.711,  lon: -74.072,  dish: { name: 'arepa',      art: dishPlate('#efc873', '#f4f0e4') } },
  { id: 'lima',        name: 'Lima',         country: 'Peru',         lat: -12.046, lon: -77.043, dish: { name: 'ceviche',    art: dishBowl('#f1e7d6', '#8fbf5a') } },
  { id: 'santiago',    name: 'Santiago',     country: 'Chile',        lat: -33.449, lon: -70.669, dish: { name: 'empanada',   art: dishRoll('#d9a05b', '#d9a05b') } },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina',    lat: -34.604, lon: -58.382, dish: { name: 'asado',      art: dishPlate('#8a4a2b', '#c0392b') } },
  { id: 'rio',         name: 'Rio de Janeiro', country: 'Brazil',     lat: -22.907, lon: -43.173, mode: 'row', dish: { name: 'feijoada', art: dishBowl('#4a3328', '#e8c27a') } },
  { id: 'dakar',       name: 'Dakar',        country: 'Senegal',      lat: 14.716, lon: -17.467,  dish: { name: 'thieboudienne', art: dishBowl('#e5894a', '#4f8a3a') } },
  { id: 'accra',       name: 'Accra',        country: 'Ghana',        lat: 5.604,  lon: -0.187,   dish: { name: 'jollof rice', art: dishBowl('#d9542c', '#f2c14e') } },
  { id: 'casablanca',  name: 'Casablanca',   country: 'Morocco',      lat: 33.573, lon: -7.589,   mode: 'row', dish: { name: 'couscous', art: dishBowl('#efd48a', '#4f8a3a') } },
  { id: 'lisbon',      name: 'Lisbon',       country: 'Portugal',     lat: 38.722, lon: -9.139,   dish: { name: 'pastel de nata', art: dishPlate('#efc873', '#f4f0e4') } },
  { id: 'madrid',      name: 'Madrid',       country: 'Spain',        lat: 40.417, lon: -3.704,   dish: { name: 'churros',    art: dishRoll('#d9a05b', '#d9a05b') } },
  { id: 'paris',       name: 'Paris',        country: 'France',       lat: 48.857, lon: 2.352,    dish: { name: 'croissant',  art: dishRoll('#d98c2b', '#d98c2b') } },
  { id: 'london',      name: 'London',       country: 'UK',           lat: 51.507, lon: -0.128,   dish: { name: 'fish and chips', art: dishPlate('#e0a43a', '#efd48a') } },
  { id: 'amsterdam',   name: 'Amsterdam',    country: 'Netherlands',  lat: 52.370, lon: 4.895,    dish: { name: 'stroopwafel', art: dishPlate('#d9a05b', '#8a5a2b') } },
  { id: 'berlin',      name: 'Berlin',       country: 'Germany',      lat: 52.520, lon: 13.405,   dish: { name: 'currywurst', art: dishPlate('#c0392b', '#d9a05b') } },
  { id: 'vienna',      name: 'Vienna',       country: 'Austria',      lat: 48.208, lon: 16.373,   dish: { name: 'schnitzel',  art: dishPlate('#e0b055', '#f2e04a') } },
  { id: 'rome',        name: 'Rome',         country: 'Italy',        lat: 41.903, lon: 12.496,   dish: { name: 'carbonara',  art: dishPlate('#f0dba0', '#6b4a2b') } },
  { id: 'athens',      name: 'Athens',       country: 'Greece',       lat: 37.984, lon: 23.728,   dish: { name: 'gyros',      art: dishRoll('#efd9a0', '#c0392b') } },
  { id: 'istanbul',    name: 'Istanbul',     country: 'Turkey',       lat: 41.008, lon: 28.978,   dish: { name: 'simit',      art: dishPlate('#d98c2b', '#efd48a') } },
  { id: 'tbilisi',     name: 'Tbilisi',      country: 'Georgia',      lat: 41.715, lon: 44.827,   dish: { name: 'khachapuri', art: dishPlate('#efc873', '#f2e04a') } },
  { id: 'dubai',       name: 'Dubai',        country: 'UAE',          lat: 25.205, lon: 55.271,   mode: 'row', dish: { name: 'shawarma', art: dishRoll('#e8c27a', '#c0392b') } },
];

// Give every city its stand-in picture if it has none yet, and work out the distance to the next city.
function greatCircleKm(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
CITIES.forEach((c, i) => {
  const next = CITIES[(i + 1) % CITIES.length];
  if (!c.art) c.art = placeholderArt(i * 977 + 13);
  c.kmToNext = Math.round(greatCircleKm(c, next) * (c.mode === 'row' ? 1.0 : 1.2) / 10) * 10;
});
