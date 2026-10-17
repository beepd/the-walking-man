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


// ---------- Batch 2 of the pictures ----------
// Phnom Penh: the Royal Palace, tiered golden roofs and a tall spire
const PHNOMPENH_ART = `
  <g fill="#e8ddc4"><rect x="14" y="120" width="132" height="46"/></g>
  <g fill="#d6c7a4"><rect x="14" y="116" width="132" height="6"/></g>
  <g fill="#e0a82e">
    <path d="M26 116 L80 90 L134 116Z"/>
    <path d="M44 98 L80 74 L116 98Z"/>
    <path d="M58 80 L80 58 L102 80Z"/>
    <path d="M72 62 L80 22 L88 62Z"/>
  </g>
  <g fill="#c0392b">
    <path d="M26 116 L80 100 L134 116Z" opacity="0.55"/>
    <path d="M44 98 L80 86 L116 98Z" opacity="0.55"/>
    <path d="M58 80 L80 70 L102 80Z" opacity="0.55"/>
  </g>
  <g fill="#e0a82e">
    <path d="M10 124 L26 100 L42 124Z"/><path d="M118 124 L134 100 L150 124Z"/>
    <rect x="25" y="94" width="2" height="8"/><rect x="133" y="94" width="2" height="8"/>
  </g>
  <g fill="#8c5a2b">
    <path d="M62 166 V138 a18 18 0 0 1 36 0 V166Z"/>
    <rect x="24" y="130" width="10" height="36"/><rect x="126" y="130" width="10" height="36"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#b9a780"/>
`;

// Hanoi: the One Pillar Pagoda standing in its lotus pond
const HANOI_ART = `
  <g fill="#6f9f5a">
    <circle cx="26" cy="108" r="22"/><circle cx="136" cy="112" r="20"/>
  </g>
  <rect x="0" y="146" width="160" height="20" fill="#8fb8a5"/>
  <g fill="#e5a8b8">
    <ellipse cx="28" cy="156" rx="9" ry="3"/><ellipse cx="128" cy="157" rx="10" ry="3"/><ellipse cx="108" cy="153" rx="6" ry="2"/>
  </g>
  <rect x="73" y="108" width="14" height="40" fill="#8e8a82"/>
  <rect x="68" y="104" width="24" height="5" fill="#7a766e"/>
  <g fill="#a8553a">
    <rect x="62" y="76" width="36" height="28"/>
  </g>
  <g fill="#7a3b2a">
    <path d="M48 78 Q80 82 112 78 L100 62 H60Z"/>
    <path d="M54 62 Q80 66 106 62 L94 48 H66Z"/>
    <path d="M62 52 L80 30 L98 52Z"/>
  </g>
  <path d="M80 30 V22" stroke="#7a3b2a" stroke-width="2"/>
  <g fill="#3a1f18"><rect x="74" y="84" width="12" height="20"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#6c8f7e"/>
`;

// Beijing: the Temple of Heaven, three blue round roofs on a white marble terrace
const BEIJING_ART = `
  <g fill="#e9e3d4">
    <rect x="12" y="152" width="136" height="14"/>
    <rect x="26" y="138" width="108" height="14"/>
    <rect x="40" y="126" width="80" height="12"/>
  </g>
  <g fill="#cfc7b4"><rect x="12" y="150" width="136" height="3"/><rect x="26" y="136" width="108" height="3"/><rect x="40" y="124" width="80" height="3"/></g>
  <g fill="#b5443a"><rect x="56" y="96" width="48" height="30"/></g>
  <g fill="#2f6fa8">
    <path d="M42 100 Q80 108 118 100 L106 84 H54Z"/>
    <path d="M50 84 Q80 90 110 84 L100 66 H60Z"/>
    <path d="M58 68 Q80 72 102 68 L94 44 Q80 24 66 44Z"/>
  </g>
  <g fill="#3b86c4">
    <path d="M42 100 Q80 104 118 100 L116 98 Q80 102 44 98Z"/>
  </g>
  <circle cx="80" cy="30" r="5" fill="#e0a82e"/>
  <g fill="#8a2f28"><rect x="66" y="108" width="6" height="18"/><rect x="88" y="108" width="6" height="18"/><rect x="77" y="108" width="6" height="18"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#bdb49d"/>
`;

// Seoul: Gwanghwamun, the palace gate, with the Namsan tower behind
const SEOUL_ART = `
  <g fill="#a9bccb">
    <rect x="124" y="70" width="4" height="86"/><rect x="118" y="86" width="16" height="6"/>
    <path d="M118 96 Q126 108 134 96 L134 150 H118Z"/>
  </g>
  <g fill="#9a9690"><rect x="10" y="126" width="140" height="40"/></g>
  <g fill="#7f7b75"><rect x="10" y="122" width="140" height="6"/></g>
  <g fill="#3a3530">
    <path d="M62 166 V146 a18 18 0 0 1 36 0 V166Z"/>
    <path d="M24 166 V150 a8 8 0 0 1 16 0 V166Z"/><path d="M120 166 V150 a8 8 0 0 1 16 0 V166Z"/>
  </g>
  <g fill="#b5443a"><rect x="40" y="96" width="80" height="28"/></g>
  <g fill="#2f4f5a">
    <path d="M24 100 Q34 102 40 94 H120 Q126 102 136 100 L120 86 H40Z"/>
    <path d="M32 70 Q48 74 60 66 H100 Q112 74 128 70 L108 54 H52Z"/>
  </g>
  <g fill="#4a6f7a"><rect x="40" y="62" width="80" height="6"/></g>
  <g fill="#3a1f18"><rect x="56" y="104" width="10" height="18"/><rect x="75" y="104" width="10" height="18"/><rect x="94" y="104" width="10" height="18"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#7f7b75"/>
`;

// Tokyo: Tokyo Tower, red and white, with city blocks around its foot
let tokyoTower = '';
for (let i = 0; i < 6; i++) {
  const y = 60 + i * 15, half = 4 + i * 4.4;
  tokyoTower += `<path d="M${80 - half} ${y} L${80 + half + 4.4} ${y + 15} M${80 + half} ${y} L${80 - half - 4.4} ${y + 15}" />`;
}
const TOKYO_ART = `
  <g fill="#a9bccb">
    <rect x="6"   y="126" width="22" height="40"/><rect x="30"  y="112" width="18" height="54"/>
    <rect x="112" y="118" width="20" height="48"/><rect x="134" y="130" width="22" height="36"/>
  </g>
  <g fill="#8fa3b4">
    <rect x="48" y="140" width="16" height="26"/><rect x="96" y="142" width="16" height="24"/>
  </g>
  <path d="M80 8 L76 60 H84Z" fill="#d9472b"/>
  <path d="M63 60 H97 L112 166 H100 L80 80 L60 166 H48Z" fill="#e8553a"/>
  <path d="M54 160 H106" stroke="#e8553a" stroke-width="5"/>
  <rect x="68" y="88" width="24" height="7" fill="#f4f0e4"/>
  <rect x="59" y="118" width="42" height="7" fill="#f4f0e4"/>
  <rect x="56" y="146" width="48" height="7" fill="#f4f0e4"/>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;


// ---------- Batch 3 of the pictures ----------
// Vancouver: Canada Place with its white sails, snowy mountains behind
const VANCOUVER_ART = `
  <path d="M0 110 L34 64 L52 86 L80 44 L112 90 L130 70 L160 112 V150 H0Z" fill="#9fb4c7"/>
  <path d="M80 44 L68 62 L76 58 L82 66 L90 58 L98 66Z" fill="#f4f8fb"/>
  <path d="M34 64 L26 76 L34 72 L40 80Z" fill="#f4f8fb"/>
  <rect x="0" y="146" width="160" height="20" fill="#8fb3c9"/>
  <rect x="14" y="136" width="132" height="12" fill="#cfd6dc"/>
  <g fill="#f4f6f8">
    <path d="M24 136 L40 96 L56 136Z"/>
    <path d="M50 136 L68 88 L86 136Z"/>
    <path d="M80 136 L98 92 L116 136Z"/>
    <path d="M108 136 L124 100 L138 136Z"/>
  </g>
  <g fill="#dfe5ea">
    <path d="M40 96 L56 136 L44 136Z"/><path d="M68 88 L86 136 L74 136Z"/><path d="M98 92 L116 136 L104 136Z"/><path d="M124 100 L138 136 L128 136Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Los Angeles: Griffith Observatory on its hill, with palm trees
function palmArt(x, h) {
  return `<rect x="${x - 1.5}" y="${166 - h}" width="3" height="${h}" fill="#7a5a3a"/>
    <g fill="#4f8a3a"><path d="M${x} ${166 - h} Q${x - 16} ${166 - h - 4} ${x - 22} ${166 - h + 10}" stroke="#4f8a3a" stroke-width="3" fill="none"/>
    <path d="M${x} ${166 - h} Q${x + 16} ${166 - h - 4} ${x + 22} ${166 - h + 10}" stroke="#4f8a3a" stroke-width="3" fill="none"/>
    <path d="M${x} ${166 - h} Q${x - 8} ${166 - h - 14} ${x - 16} ${166 - h - 8}" stroke="#5fa045" stroke-width="3" fill="none"/>
    <path d="M${x} ${166 - h} Q${x + 8} ${166 - h - 14} ${x + 16} ${166 - h - 8}" stroke="#5fa045" stroke-width="3" fill="none"/></g>`;
}
const LOSANGELES_ART = `
  <path d="M0 166 V120 Q40 96 80 104 Q120 96 160 124 V166Z" fill="#c9b27a"/>
  <g fill="#f1ece0">
    <rect x="34" y="92" width="92" height="22"/>
    <rect x="64" y="86" width="32" height="28"/>
  </g>
  <g fill="#e2dccb"><rect x="34" y="110" width="92" height="4"/></g>
  <g fill="#7fb59c">
    <path d="M70 86 a10 10 0 0 1 20 0Z"/>
    <path d="M38 92 a8 8 0 0 1 16 0Z"/><path d="M106 92 a8 8 0 0 1 16 0Z"/>
  </g>
  <g fill="#6b8f80"><rect x="79" y="62" width="2" height="12"/></g>
  <g fill="#3a4b52"><rect x="76" y="98" width="8" height="16"/></g>
  ${palmArt(28, 78)}
  ${palmArt(134, 90)}
  ${palmArt(116, 58)}
  <rect x="0" y="166" width="160" height="4" fill="#a89562"/>
`;

// Mexico City: the Angel of Independence, a golden figure on a tall column
const MEXICOCITY_ART = `
  <g fill="#e6dccb">
    <rect x="30" y="152" width="100" height="14"/>
    <rect x="42" y="140" width="76" height="12"/>
    <rect x="54" y="128" width="52" height="12"/>
    <rect x="68" y="60" width="24" height="68"/>
    <rect x="62" y="54" width="36" height="8"/>
  </g>
  <g fill="#cfc4ae"><rect x="68" y="60" width="6" height="68"/><rect x="30" y="150" width="100" height="3"/></g>
  <g fill="#d9a62e">
    <circle cx="80" cy="30" r="5"/>
    <rect x="77" y="34" width="6" height="20"/>
    <path d="M77 38 Q56 24 46 40 Q62 38 77 46Z"/>
    <path d="M83 38 Q104 24 114 40 Q98 38 83 46Z"/>
  </g>
  <g fill="#7fa650"><circle cx="22" cy="140" r="14"/><circle cx="140" cy="142" r="12"/></g>
  <g fill="#c9a77a"><rect x="4" y="126" width="22" height="40"/><rect x="134" y="132" width="22" height="34"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#b8ad98"/>
`;

// Panama City: the glass skyline on the bay, with the sail-shaped tower
const PANAMA_ART = `
  <g fill="#9db8c9">
    <rect x="8"   y="90"  width="22" height="76"/>
    <rect x="32"  y="64"  width="20" height="102"/>
    <rect x="108" y="76"  width="22" height="90"/>
    <rect x="132" y="104" width="20" height="62"/>
  </g>
  <g fill="#7f9db0">
    <rect x="12" y="98" width="4" height="64"/><rect x="38" y="72" width="4" height="94"/>
  </g>
  <path d="M60 166 V52 Q86 40 100 60 V166Z" fill="#c9dbe6"/>
  <path d="M60 52 Q86 40 100 60 V80 Q80 62 60 76Z" fill="#e9f2f7"/>
  <g stroke="#9db8c9" stroke-width="1.5"><path d="M60 100 H100 M60 124 H100 M60 148 H100"/></g>
  <rect x="0" y="152" width="160" height="14" fill="#8fb3c9"/>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Bogota: Monserrate hill with its white church, and red-roofed houses below
const BOGOTA_ART = `
  <path d="M0 120 Q30 84 70 70 Q104 60 130 82 Q150 96 160 118 V150 H0Z" fill="#6f9a6a"/>
  <path d="M40 100 Q80 66 126 90 V150 H40Z" fill="#5f8a5c" opacity="0.7"/>
  <g fill="#f4f1e8">
    <rect x="82" y="50" width="22" height="16"/>
    <rect x="86" y="42" width="14" height="10"/>
  </g>
  <path d="M82 50 L93 40 L104 50Z" fill="#b5443a"/>
  <path d="M93 40 V32 M89 35 H97" stroke="#f4f1e8" stroke-width="2"/>
  <path d="M40 150 L88 66" stroke="#4a4a4a" stroke-width="1.2"/>
  <rect x="62" y="112" width="8" height="6" fill="#e8c27a" transform="rotate(-30 66 115)"/>
  <g fill="#f1e7d6">
    <rect x="6" y="130" width="26" height="36"/><rect x="34" y="138" width="22" height="28"/>
    <rect x="58" y="132" width="26" height="34"/><rect x="88" y="140" width="22" height="26"/>
    <rect x="112" y="128" width="26" height="38"/><rect x="138" y="138" width="20" height="28"/>
  </g>
  <g fill="#b5443a">
    <path d="M4 130 L19 118 L34 130Z"/><path d="M32 138 L45 128 L58 138Z"/><path d="M56 132 L71 120 L86 132Z"/>
    <path d="M86 140 L99 130 L112 140Z"/><path d="M110 128 L125 116 L140 128Z"/><path d="M136 138 L148 128 L160 138Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#8e8a78"/>
`;


// ---------- Batch 4 of the pictures ----------
// Lima: the cathedral on the Plaza Mayor, yellow with twin towers
const LIMA_ART = `
  <g fill="#e8c76a">
    <rect x="28" y="96" width="104" height="70"/>
    <rect x="30" y="52" width="26" height="46"/>
    <rect x="104" y="52" width="26" height="46"/>
    <rect x="58" y="76" width="44" height="22"/>
  </g>
  <g fill="#d1ab4a">
    <rect x="26" y="94" width="108" height="5"/>
    <rect x="28" y="48" width="30" height="5"/><rect x="102" y="48" width="30" height="5"/>
  </g>
  <g fill="#7fa8a0">
    <path d="M32 48 a11 11 0 0 1 22 0Z"/><path d="M106 48 a11 11 0 0 1 22 0Z"/>
    <path d="M68 76 a12 12 0 0 1 24 0Z"/>
  </g>
  <g fill="#6b5a3a"><rect x="42" y="30" width="2" height="10"/><rect x="116" y="30" width="2" height="10"/></g>
  <g fill="#7a5a32">
    <path d="M68 166 V124 a12 12 0 0 1 24 0 V166Z"/>
    <path d="M36 166 V132 a6 6 0 0 1 12 0 V166Z"/><path d="M112 166 V132 a6 6 0 0 1 12 0 V166Z"/>
    <rect x="38" y="68" width="10" height="16"/><rect x="112" y="68" width="10" height="16"/>
  </g>
  <rect x="26" y="108" width="12" height="5" fill="#8b5a2b"/><rect x="122" y="108" width="12" height="5" fill="#8b5a2b"/>
  <rect x="0" y="166" width="160" height="4" fill="#bfa04a"/>
`;

// Santiago: snowy Andes behind the city towers
const SANTIAGO_ART = `
  <path d="M0 120 L26 70 L44 90 L70 40 L98 84 L118 60 L160 116 V150 H0Z" fill="#9fb4c7"/>
  <path d="M70 40 L58 60 L66 56 L72 66 L80 56 L88 62Z" fill="#f4f8fb"/>
  <path d="M26 70 L18 84 L26 80 L32 88Z" fill="#f4f8fb"/>
  <path d="M118 60 L110 74 L118 70 L124 78Z" fill="#f4f8fb"/>
  <g fill="#b8c9d6">
    <rect x="12" y="118" width="22" height="48"/><rect x="36" y="132" width="18" height="34"/>
    <rect x="108" y="122" width="22" height="44"/><rect x="132" y="134" width="20" height="32"/>
  </g>
  <rect x="64" y="52" width="32" height="114" fill="#7f98ab"/>
  <rect x="68" y="40" width="24" height="14" fill="#6a8296"/>
  <rect x="79" y="22" width="2" height="20" fill="#6a8296"/>
  <g fill="#9bb2c2"><rect x="70" y="62" width="4" height="96"/><rect x="86" y="62" width="4" height="96"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Buenos Aires: the Obelisco, with city blocks around it
const BUENOSAIRES_ART = `
  <g fill="#c9b9a3">
    <rect x="6" y="104" width="30" height="62"/><rect x="38" y="122" width="22" height="44"/>
    <rect x="100" y="116" width="26" height="50"/><rect x="128" y="100" width="26" height="66"/>
  </g>
  <g fill="#b3a28b">
    <rect x="12" y="112" width="5" height="10"/><rect x="24" y="112" width="5" height="10"/>
    <rect x="134" y="108" width="5" height="10"/><rect x="144" y="108" width="5" height="10"/>
  </g>
  <path d="M80 10 L90 44 L94 166 H66 L70 44Z" fill="#efeae0"/>
  <path d="M80 10 L90 44 L94 166 H84 L84 44Z" fill="#d8d1c2"/>
  <path d="M80 10 L74 28 H86Z" fill="#e8e2d4"/>
  <rect x="62" y="158" width="36" height="8" fill="#d8d1c2"/>
  <rect x="0" y="166" width="160" height="4" fill="#a99884"/>
`;

// Rio de Janeiro: Corcovado with the Christ statue, and the Sugarloaf beside it
const RIO_ART = `
  <rect x="0" y="150" width="160" height="16" fill="#8fb3c9"/>
  <path d="M96 150 Q104 104 130 98 Q152 98 156 150Z" fill="#6f8f6a"/>
  <path d="M0 150 Q12 70 52 56 Q76 52 84 80 Q92 120 100 150Z" fill="#5f8a5c"/>
  <path d="M10 150 Q22 92 54 76 Q70 74 76 98 Q82 124 90 150Z" fill="#6f9a6a" opacity="0.55"/>
  <g fill="#e4dfd2" stroke="#8d8878" stroke-width="1.5" stroke-linejoin="round">
    <rect x="50" y="34" width="6" height="30"/>
    <rect x="36" y="38" width="34" height="6"/>
    <circle cx="53" cy="30" r="4.5"/>
  </g>
  <g fill="#f1e7d6">
    <rect x="96" y="138" width="16" height="12"/><rect x="116" y="132" width="16" height="18"/><rect x="136" y="140" width="16" height="10"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Dakar: the Great Mosque with its minarets, and a baobab tree
const DAKAR_ART = `
  <g fill="#8a6a4a">
    <rect x="124" y="104" width="12" height="62"/>
    <path d="M118 104 Q110 90 100 86 M130 104 Q130 84 128 74 M142 104 Q150 92 160 88" stroke="#8a6a4a" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>
  <g fill="#5f8a3a">
    <circle cx="98" cy="84" r="9"/><circle cx="128" cy="68" r="10"/><circle cx="154" cy="86" r="9"/>
    <circle cx="112" cy="78" r="7"/><circle cx="142" cy="76" r="7"/>
  </g>
  <g fill="#f1ede2">
    <rect x="14" y="108" width="84" height="58"/>
    <rect x="10" y="60" width="14" height="48"/><rect x="88" y="60" width="14" height="48"/>
    <rect x="34" y="96" width="44" height="14"/>
  </g>
  <g fill="#d8d2c2"><rect x="8" y="104" width="18" height="4"/><rect x="86" y="104" width="18" height="4"/></g>
  <g fill="#3b8f8a">
    <path d="M10 60 a7 7 0 0 1 14 0Z"/><path d="M88 60 a7 7 0 0 1 14 0Z"/>
    <path d="M40 96 a16 16 0 0 1 32 0Z"/>
  </g>
  <g fill="#2f6f6a">
    <path d="M42 166 V132 a14 14 0 0 1 28 0 V166Z"/>
    <path d="M17 166 V138 a5 5 0 0 1 10 0 V166Z"/><path d="M85 166 V138 a5 5 0 0 1 10 0 V166Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#c9b48a"/>
`;


// ---------- Batch 5 of the pictures ----------
// Accra: the Independence Arch with the Black Star on top
const ACCRA_ART = `
  <g fill="#7fa650"><circle cx="16" cy="140" r="16"/><circle cx="146" cy="142" r="14"/></g>
  <g fill="#e9e1cf">
    <rect x="22" y="84" width="30" height="82"/>
    <rect x="108" y="84" width="30" height="82"/>
    <rect x="22" y="70" width="116" height="20"/>
  </g>
  <g fill="#d2c8b0"><rect x="22" y="86" width="116" height="4"/><rect x="22" y="70" width="116" height="3"/></g>
  <g fill="#c0392b"><rect x="22" y="76" width="116" height="4"/></g>
  <g fill="#e0a82e"><rect x="22" y="80" width="116" height="3"/></g>
  <g fill="#2f8a4a"><rect x="22" y="83" width="116" height="3"/></g>
  <path d="M52 166 V120 Q80 78 108 120 V166Z" fill="#4a7ea8" opacity="0.0"/>
  <path d="M80 18 L85 33 L101 34 L88 44 L93 60 L80 51 L67 60 L72 44 L59 34 L75 33Z" fill="#1d1d1d"/>
  <g fill="#c9bfa8"><rect x="22" y="150" width="30" height="16"/><rect x="108" y="150" width="30" height="16"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#b8ad98"/>
`;

// Casablanca: the Hassan II Mosque, with its tall minaret, beside the sea
const CASABLANCA_ART = `
  <rect x="0" y="150" width="160" height="16" fill="#8fb3c9"/>
  <g fill="#f1ede2">
    <rect x="96" y="22" width="26" height="128"/>
    <rect x="94" y="22" width="30" height="6"/>
    <rect x="14" y="104" width="86" height="46"/>
  </g>
  <g fill="#d8d2c2">
    <rect x="96" y="22" width="5" height="128"/>
    <rect x="94" y="62" width="30" height="3"/><rect x="94" y="96" width="30" height="3"/>
  </g>
  <g fill="#2f8a6f">
    <path d="M100 22 L109 4 L118 22Z"/>
    <rect x="108" y="0" width="2" height="6"/>
    <rect x="14" y="100" width="86" height="6"/>
  </g>
  <g fill="#3b9d83"><rect x="18" y="108" width="78" height="3" opacity="0.7"/></g>
  <g fill="#2f6f6a">
    <path d="M24 150 V128 a9 9 0 0 1 18 0 V150Z"/><path d="M48 150 V128 a9 9 0 0 1 18 0 V150Z"/><path d="M72 150 V128 a9 9 0 0 1 18 0 V150Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Lisbon: the Belem Tower on the river
const LISBON_ART = `
  <rect x="0" y="146" width="160" height="20" fill="#8fb3c9"/>
  <g fill="#e6dcc6">
    <rect x="48" y="62" width="64" height="86"/>
    <rect x="40" y="132" width="80" height="18"/>
    <rect x="42" y="52" width="14" height="22"/><rect x="104" y="52" width="14" height="22"/>
    <rect x="68" y="42" width="24" height="24"/>
  </g>
  <g fill="#cfc3a8">
    <rect x="46" y="60" width="68" height="4"/><rect x="38" y="130" width="84" height="4"/>
    <rect x="48" y="92" width="64" height="3"/>
  </g>
  <g fill="#d9cdb2">
    ${merlons(50, 110, 54, 6, 4, 6)}
  </g>
  <g fill="#b5443a">
    <path d="M42 52 a7 7 0 0 1 14 0Z"/><path d="M104 52 a7 7 0 0 1 14 0Z"/>
    <path d="M68 42 L80 26 L92 42Z"/>
  </g>
  <g fill="#6b5a3a">
    <path d="M70 126 V108 a8 8 0 0 1 16 0 V126Z" opacity="0.0"/>
    <path d="M74 92 V82 a6 6 0 0 1 12 0 V92Z"/><path d="M58 118 V108 a5 5 0 0 1 10 0 V118Z"/><path d="M92 118 V108 a5 5 0 0 1 10 0 V118Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Madrid: the Puerta de Alcala, a triple arch with sculptures on top
const MADRID_ART = `
  <g fill="#7fa650"><circle cx="12" cy="130" r="15"/><circle cx="148" cy="132" r="14"/></g>
  <g fill="#e6d5b8">
    <rect x="26" y="82" width="108" height="84"/>
    <rect x="26" y="70" width="108" height="14"/>
    <rect x="62" y="52" width="36" height="20"/>
  </g>
  <g fill="#cdbb9a">
    <rect x="22" y="78" width="116" height="6"/><rect x="58" y="66" width="44" height="5"/>
    <rect x="26" y="110" width="108" height="3"/>
    <rect x="38" y="82" width="4" height="84"/><rect x="118" y="82" width="4" height="84"/>
    <rect x="54" y="82" width="4" height="84"/><rect x="102" y="82" width="4" height="84"/>
  </g>
  <g fill="#5a4a38">
    <path d="M62 166 V118 a18 18 0 0 1 36 0 V166Z"/>
    <path d="M30 166 V132 a6 6 0 0 1 12 0 V166Z"/><path d="M118 166 V132 a6 6 0 0 1 12 0 V166Z"/>
  </g>
  <g fill="#d9a62e"><rect x="68" y="42" width="24" height="10"/><circle cx="80" cy="36" r="5"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#b8a888"/>
`;

// Paris: the Eiffel Tower
const PARIS_ART = `
  <g fill="#c9c0ae">
    <rect x="6" y="126" width="26" height="40"/><rect x="128" y="130" width="26" height="36"/>
  </g>
  <g fill="#b5ab97"><rect x="30" y="140" width="20" height="26"/><rect x="110" y="142" width="20" height="24"/></g>
  <g fill="#8a6a4a">
    <path d="M80 6 L84 34 H76Z"/>
    <path d="M75 34 H85 L90 78 H70Z"/>
    <path d="M70 78 H90 L100 122 H60Z"/>
    <path d="M60 122 H100 L120 166 H104 Q96 138 80 134 Q64 138 56 166 H40Z"/>
  </g>
  <g fill="#6f533a">
    <rect x="66" y="76" width="28" height="5"/>
    <rect x="54" y="118" width="52" height="6"/>
    <path d="M80 6 L82 34 H80Z"/>
  </g>
  <g stroke="#6f533a" stroke-width="1.4" fill="none">
    <path d="M72 38 L88 76 M88 38 L72 76"/><path d="M66 84 L94 120 M94 84 L66 120"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#9b9283"/>
`;


// ---------- Batch 6 of the pictures ----------
// London: the Elizabeth Tower (Big Ben) beside Westminster
const LONDON_ART = `
  <g fill="#c9b98e">
    <rect x="8" y="110" width="76" height="56"/>
    <rect x="8" y="100" width="76" height="12"/>
  </g>
  <g fill="#b3a477">
    <rect x="12" y="116" width="6" height="14"/><rect x="26" y="116" width="6" height="14"/><rect x="40" y="116" width="6" height="14"/>
    <rect x="54" y="116" width="6" height="14"/><rect x="68" y="116" width="6" height="14"/>
    <rect x="6" y="98" width="80" height="4"/>
  </g>
  <g fill="#d8c89a">
    <rect x="100" y="50" width="26" height="116"/>
    <rect x="97" y="44" width="32" height="8"/>
    <rect x="102" y="26" width="22" height="20"/>
  </g>
  <g fill="#bfae80"><rect x="100" y="50" width="5" height="116"/><rect x="97" y="108" width="32" height="3"/></g>
  <circle cx="113" cy="36" r="8" fill="#f4f0e4" stroke="#8a7a52" stroke-width="2"/>
  <path d="M113 31 V36 H117" stroke="#3a3a3a" stroke-width="1.6" fill="none"/>
  <g fill="#6f7f66"><path d="M104 26 L113 4 L122 26Z"/><rect x="112" y="0" width="2" height="6"/></g>
  <g fill="#8a7a52"><rect x="106" y="62" width="4" height="12"/><rect x="116" y="62" width="4" height="12"/><rect x="106" y="86" width="4" height="12"/><rect x="116" y="86" width="4" height="12"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#9b8c64"/>
`;

// Amsterdam: tall narrow canal houses with stepped gables, and the canal
const AMSTERDAM_ART = `
  <rect x="0" y="152" width="160" height="14" fill="#8fb3c9"/>
  <g fill="#a8553a">
    <rect x="6" y="84" width="26" height="68"/><path d="M6 84 H12 V76 H18 V68 H24 V76 H30 V84Z"/>
  </g>
  <g fill="#d9c9a0">
    <rect x="34" y="70" width="24" height="82"/><path d="M34 70 L46 52 L58 70Z"/>
  </g>
  <g fill="#7a8f6a">
    <rect x="60" y="92" width="26" height="60"/><path d="M60 92 Q73 70 86 92Z"/>
  </g>
  <g fill="#b5443a">
    <rect x="88" y="78" width="24" height="74"/><path d="M88 78 H94 V70 H100 V62 H106 V70 H112 V78Z"/>
  </g>
  <g fill="#e0cfa0">
    <rect x="114" y="88" width="22" height="64"/><path d="M114 88 L125 72 L136 88Z"/>
  </g>
  <g fill="#8a6a5a">
    <rect x="138" y="96" width="18" height="56"/><path d="M138 96 H156 V90 H150 V84 H144 V90 H138Z"/>
  </g>
  <g fill="#f4efe0">
    <rect x="12" y="94" width="6" height="10"/><rect x="22" y="94" width="6" height="10"/>
    <rect x="12" y="118" width="6" height="10"/><rect x="22" y="118" width="6" height="10"/>
    <rect x="40" y="80" width="6" height="10"/><rect x="48" y="80" width="6" height="10"/>
    <rect x="40" y="108" width="6" height="10"/><rect x="48" y="108" width="6" height="10"/>
    <rect x="66" y="102" width="6" height="10"/><rect x="76" y="102" width="6" height="10"/>
    <rect x="94" y="90" width="6" height="10"/><rect x="102" y="90" width="6" height="10"/>
    <rect x="120" y="98" width="6" height="10"/><rect x="128" y="98" width="6" height="10"/>
    <rect x="142" y="106" width="5" height="9"/><rect x="149" y="106" width="5" height="9"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#6a8296"/>
`;

// Berlin: the Brandenburg Gate with its chariot
let berlinColumns = '';
for (const x of [24, 42, 60, 92, 110, 128]) berlinColumns += `<rect x="${x}" y="82" width="9" height="84"/>`;
const BERLIN_ART = `
  <g fill="#dcd2b8">
    <rect x="14" y="70" width="132" height="14"/>
    <rect x="14" y="60" width="132" height="12"/>
    <rect x="18" y="82" width="124" height="4"/>
    <g>${berlinColumns}</g>
  </g>
  <g fill="#c2b698"><rect x="14" y="72" width="132" height="3"/><rect x="14" y="82" width="132" height="2"/></g>
  <rect x="68" y="82" width="24" height="84" fill="#b8ad98" opacity="0.0"/>
  <g fill="#6f8f74">
    <rect x="62" y="40" width="36" height="10"/>
    <path d="M70 40 Q72 24 82 24 Q90 24 92 40Z"/>
    <path d="M62 38 L40 38 L46 28 L66 32Z" opacity="0.0"/>
    <circle cx="80" cy="18" r="3.5"/>
    <path d="M88 24 L100 12 L102 18 L92 28Z"/>
    <path d="M76 24 L66 12 L64 18 L72 28Z"/>
  </g>
  <rect x="58" y="50" width="44" height="10" fill="#cfc4a8"/>
  <rect x="0" y="166" width="160" height="4" fill="#a99f86"/>
`;

// Vienna: St. Stephen's Cathedral, with its tall spire and patterned roof
let viennaRoof = '';
for (let i = 0; i < 6; i++) {
  const x = 12 + i * 22;
  viennaRoof += `<path d="M${x} 124 L${x + 11} 112 L${x + 22} 124Z" fill="${i % 2 ? '#d6a62e' : '#2f8a6f'}"/>`;
}
const VIENNA_ART = `
  <g fill="#b9ae96">
    <rect x="12" y="124" width="136" height="42"/>
    <path d="M12 124 L80 90 L148 124Z"/>
  </g>
  <g>${viennaRoof}</g>
  <path d="M12 124 L80 90 L148 124Z" fill="#8a6a4a" opacity="0.0"/>
  <g fill="#a99f86">
    <rect x="104" y="56" width="26" height="70"/>
    <path d="M104 56 L117 6 L130 56Z"/>
  </g>
  <g fill="#948a72"><rect x="104" y="56" width="5" height="70"/><path d="M117 6 L123 30 L117 56Z" opacity="0.5"/></g>
  <g fill="#6a6252"><rect x="110" y="70" width="6" height="14"/><rect x="118" y="70" width="6" height="14"/><rect x="110" y="94" width="6" height="14"/><rect x="118" y="94" width="6" height="14"/></g>
  <g fill="#5a4f3c">
    <path d="M60 166 V140 a20 20 0 0 1 40 0 V166Z"/>
    <path d="M22 166 V146 a6 6 0 0 1 12 0 V166Z"/><path d="M126 166 V146 a6 6 0 0 1 12 0 V166Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#948a72"/>
`;

// Rome: the Colosseum, rows of arches
function colosseumRow(y, h, n, x0, x1) {
  let out = '';
  const w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const cx = x0 + w * i + w / 2;
    out += `<path d="M${(cx - w * 0.28).toFixed(1)} ${y + h} V${y + 4} a${(w * 0.28).toFixed(1)} 4 0 0 1 ${(w * 0.56).toFixed(1)} 0 V${y + h}Z"/>`;
  }
  return out;
}
const ROME_ART = `
  <path d="M8 166 V70 Q80 54 152 70 V166Z" fill="#d4b98a"/>
  <path d="M8 70 Q80 54 152 70 L152 78 Q80 62 8 78Z" fill="#bfa273"/>
  <path d="M104 70 Q132 62 152 70 V92 H104Z" fill="#d4b98a"/>
  <g fill="#6a4f32">
    ${colosseumRow(80, 22, 8, 14, 146)}
    ${colosseumRow(106, 24, 8, 14, 146)}
    ${colosseumRow(134, 28, 8, 14, 146)}
  </g>
  <g fill="#bfa273"><rect x="8" y="103" width="144" height="3"/><rect x="8" y="130" width="144" height="3"/></g>
  <g fill="#6f9a5a"><circle cx="152" cy="148" r="10"/><circle cx="6" cy="152" r="9"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#a8905f"/>
`;


// ---------- Batch 7 of the pictures ----------
// Athens: the Parthenon on the Acropolis
let parthenonCols = '';
for (let i = 0; i < 8; i++) parthenonCols += `<rect x="${24 + i * 14}" y="82" width="8" height="54"/>`;
const ATHENS_ART = `
  <path d="M0 166 V150 Q20 128 50 126 H110 Q140 128 160 150 V166Z" fill="#b8a27a"/>
  <g fill="#ece3cd">
    <path d="M16 82 L80 52 L144 82Z"/>
    <rect x="16" y="82" width="128" height="8"/>
    <g>${parthenonCols}</g>
    <rect x="16" y="134" width="128" height="6"/>
    <rect x="10" y="140" width="140" height="6"/>
  </g>
  <g fill="#d4c8aa"><path d="M30 80 L80 58 L130 80Z"/><rect x="16" y="88" width="128" height="3"/></g>
  <g fill="#ece3cd" opacity="0.0"><rect x="0" y="0" width="1" height="1"/></g>
  <g fill="#7fa650"><circle cx="8" cy="156" r="9"/><circle cx="152" cy="158" r="8"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#9e8a62"/>
`;

// Istanbul: Hagia Sophia, a great dome with four minarets
const ISTANBUL_ART = `
  <g fill="#d9c39a">
    <rect x="36" y="100" width="88" height="66"/>
    <path d="M36 100 a14 14 0 0 1 14 -14 V100Z"/><path d="M124 100 a14 14 0 0 0 -14 -14 V100Z"/>
    <path d="M42 126 a18 18 0 0 1 18 -18 V126Z" opacity="0.0"/>
  </g>
  <path d="M50 100 a30 30 0 0 1 60 0Z" fill="#c9ae80"/>
  <path d="M56 100 a24 24 0 0 1 48 0Z" fill="#8f9fa8"/>
  <path d="M60 100 Q80 36 100 100Z" fill="#8f9fa8" opacity="0.0"/>
  <path d="M60 86 Q80 40 100 86Z" fill="#9aa9b2"/>
  <rect x="79" y="36" width="2" height="22" fill="#c9ae80"/>
  <g fill="#e8e0cf">
    <rect x="12" y="70" width="9" height="96"/><rect x="139" y="70" width="9" height="96"/>
    <rect x="26" y="88" width="7" height="78"/><rect x="127" y="88" width="7" height="78"/>
  </g>
  <g fill="#8f9fa8">
    <path d="M11 70 L16.5 46 L22 70Z"/><path d="M138 70 L143.5 46 L149 70Z"/>
    <path d="M25 88 L29.5 68 L34 88Z"/><path d="M126 88 L130.5 68 L135 88Z"/>
  </g>
  <g fill="#b9a67e"><rect x="10" y="78" width="13" height="3"/><rect x="137" y="78" width="13" height="3"/></g>
  <g fill="#5a4a38">
    <path d="M70 166 V138 a10 10 0 0 1 20 0 V166Z"/>
    <path d="M44 166 V132 a6 6 0 0 1 12 0 V166Z"/><path d="M104 166 V132 a6 6 0 0 1 12 0 V166Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#a99a78"/>
`;

// Tbilisi: Narikala fortress on its hill, with old houses and balconies below
const TBILISI_ART = `
  <path d="M0 150 Q10 86 60 66 Q110 56 160 96 V150Z" fill="#8b9b6a"/>
  <g fill="#b8a98a">
    <rect x="36" y="64" width="64" height="20"/>
    <rect x="30" y="48" width="14" height="30"/><rect x="92" y="44" width="14" height="34"/>
  </g>
  <g fill="#a49573">
    ${merlons(36, 100, 58, 6, 5, 6)}
    <path d="M30 48 L37 36 L44 48Z"/><path d="M92 44 L99 30 L106 44Z"/>
  </g>
  <g fill="#8a4a3a"><path d="M30 48 L37 38 L44 48Z"/><path d="M92 44 L99 32 L106 44Z"/></g>
  <g fill="#e8d6b0">
    <rect x="6"   y="122" width="28" height="44"/><rect x="36"  y="130" width="26" height="36"/>
    <rect x="64"  y="120" width="30" height="46"/><rect x="96"  y="128" width="26" height="38"/>
    <rect x="124" y="124" width="30" height="42"/>
  </g>
  <g fill="#8a5a32">
    <rect x="4"  y="136" width="32" height="5"/><rect x="62" y="134" width="34" height="5"/><rect x="122" y="138" width="34" height="5"/>
    <rect x="34" y="144" width="30" height="4"/><rect x="94" y="144" width="30" height="4"/>
  </g>
  <g fill="#b5443a">
    <path d="M4 122 L20 110 L36 122Z"/><path d="M34 130 L49 120 L64 130Z"/><path d="M62 120 L79 108 L96 120Z"/>
    <path d="M94 128 L109 118 L124 128Z"/><path d="M122 124 L139 112 L156 124Z"/>
  </g>
  <rect x="0" y="166" width="160" height="4" fill="#8e8a78"/>
`;

// Dubai: the Burj Khalifa, a tall stepped needle among glass towers
const DUBAI_ART = `
  <g fill="#b8cad6">
    <rect x="4"  y="96" width="22" height="70"/><rect x="28" y="116" width="18" height="50"/>
    <rect x="114" y="104" width="20" height="62"/><rect x="136" y="122" width="20" height="44"/>
  </g>
  <g fill="#9fb4c3"><rect x="10" y="104" width="4" height="56"/><rect x="120" y="112" width="4" height="48"/></g>
  <g fill="#cfdde7">
    <path d="M72 166 V108 H88 V166Z"/>
    <path d="M70 110 L72 86 H88 L90 110Z"/>
    <path d="M72 88 L74 66 H86 L88 88Z"/>
    <path d="M74 68 L76 48 H84 L86 68Z"/>
    <path d="M76 50 L78 32 H82 L84 50Z"/>
    <path d="M79 34 L80 4 L81 34Z"/>
  </g>
  <g fill="#9fb4c3"><path d="M80 4 L81 34 H80Z"/><path d="M80 110 H88 V166 H80Z"/><path d="M80 88 H88 V110 H80Z"/></g>
  <g fill="#7f98ab"><rect x="52" y="140" width="14" height="26"/><rect x="94" y="136" width="14" height="30"/></g>
  <rect x="0" y="166" width="160" height="4" fill="#c9b48a"/>
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
  { id: 'phnompenh',   name: 'Phnom Penh',   country: 'Cambodia',     lat: 11.556, lon: 104.928, art: PHNOMPENH_ART,  dish: { name: 'fish amok',  art: dishBowl('#e9b44c', '#4f8a3a') } },
  { id: 'hanoi',       name: 'Hanoi',        country: 'Vietnam',      lat: 21.028, lon: 105.854, art: HANOI_ART,  dish: { name: 'pho',        art: dishBowl('#d9b77a', '#4f8a3a') } },
  { id: 'beijing',     name: 'Beijing',      country: 'China',        lat: 39.904, lon: 116.407, art: BEIJING_ART,  dish: { name: 'dumplings',  art: dishPlate('#f1e7d6', '#c0392b') } },
  { id: 'seoul',       name: 'Seoul',        country: 'South Korea',  lat: 37.566, lon: 126.978, art: SEOUL_ART,  dish: { name: 'bibimbap',   art: dishBowl('#f1e7d6', '#c0392b') } },
  { id: 'tokyo',       name: 'Tokyo',        country: 'Japan',        lat: 35.676, lon: 139.650, art: TOKYO_ART,  mode: 'row', dish: { name: 'sushi', art: dishPlate('#f1e7d6', '#e8795a') } },
  { id: 'vancouver',   name: 'Vancouver',    country: 'Canada',       lat: 49.283, lon: -123.121, art: VANCOUVER_ART, dish: { name: 'salmon',     art: dishPlate('#e8795a', '#8fbf5a') } },
  { id: 'losangeles',  name: 'Los Angeles',  country: 'USA',          lat: 34.052, lon: -118.244, art: LOSANGELES_ART, dish: { name: 'fish tacos', art: dishPlate('#e8c27a', '#4f8a3a') } },
  { id: 'mexicocity',  name: 'Mexico City',  country: 'Mexico',       lat: 19.433, lon: -99.133, art: MEXICOCITY_ART,  dish: { name: 'tacos al pastor', art: dishPlate('#e0a43a', '#c0392b') } },
  { id: 'panama',      name: 'Panama City',  country: 'Panama',       lat: 8.983,  lon: -79.517, art: PANAMA_ART,  dish: { name: 'sancocho',   art: dishBowl('#d9b45a', '#4f8a3a') } },
  { id: 'bogota',      name: 'Bogotá',  country: 'Colombia',     lat: 4.711,  lon: -74.072, art: BOGOTA_ART,  dish: { name: 'arepa',      art: dishPlate('#efc873', '#f4f0e4') } },
  { id: 'lima',        name: 'Lima',         country: 'Peru',         lat: -12.046, lon: -77.043, art: LIMA_ART, dish: { name: 'ceviche',    art: dishBowl('#f1e7d6', '#8fbf5a') } },
  { id: 'santiago',    name: 'Santiago',     country: 'Chile',        lat: -33.449, lon: -70.669, art: SANTIAGO_ART, dish: { name: 'empanada',   art: dishRoll('#d9a05b', '#d9a05b') } },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina',    lat: -34.604, lon: -58.382, art: BUENOSAIRES_ART, dish: { name: 'asado',      art: dishPlate('#8a4a2b', '#c0392b') } },
  { id: 'rio',         name: 'Rio de Janeiro', country: 'Brazil',     lat: -22.907, lon: -43.173, art: RIO_ART, mode: 'row', dish: { name: 'feijoada', art: dishBowl('#4a3328', '#e8c27a') } },
  { id: 'dakar',       name: 'Dakar',        country: 'Senegal',      lat: 14.716, lon: -17.467, art: DAKAR_ART,  dish: { name: 'thieboudienne', art: dishBowl('#e5894a', '#4f8a3a') } },
  { id: 'accra',       name: 'Accra',        country: 'Ghana',        lat: 5.604,  lon: -0.187, art: ACCRA_ART,   dish: { name: 'jollof rice', art: dishBowl('#d9542c', '#f2c14e') } },
  { id: 'casablanca',  name: 'Casablanca',   country: 'Morocco',      lat: 33.573, lon: -7.589, art: CASABLANCA_ART,   mode: 'row', dish: { name: 'couscous', art: dishBowl('#efd48a', '#4f8a3a') } },
  { id: 'lisbon',      name: 'Lisbon',       country: 'Portugal',     lat: 38.722, lon: -9.139, art: LISBON_ART,   dish: { name: 'pastel de nata', art: dishPlate('#efc873', '#f4f0e4') } },
  { id: 'madrid',      name: 'Madrid',       country: 'Spain',        lat: 40.417, lon: -3.704, art: MADRID_ART,   dish: { name: 'churros',    art: dishRoll('#d9a05b', '#d9a05b') } },
  { id: 'paris',       name: 'Paris',        country: 'France',       lat: 48.857, lon: 2.352, art: PARIS_ART,    dish: { name: 'croissant',  art: dishRoll('#d98c2b', '#d98c2b') } },
  { id: 'london',      name: 'London',       country: 'UK',           lat: 51.507, lon: -0.128, art: LONDON_ART,   dish: { name: 'fish and chips', art: dishPlate('#e0a43a', '#efd48a') } },
  { id: 'amsterdam',   name: 'Amsterdam',    country: 'Netherlands',  lat: 52.370, lon: 4.895, art: AMSTERDAM_ART,    dish: { name: 'stroopwafel', art: dishPlate('#d9a05b', '#8a5a2b') } },
  { id: 'berlin',      name: 'Berlin',       country: 'Germany',      lat: 52.520, lon: 13.405, art: BERLIN_ART,   dish: { name: 'currywurst', art: dishPlate('#c0392b', '#d9a05b') } },
  { id: 'vienna',      name: 'Vienna',       country: 'Austria',      lat: 48.208, lon: 16.373, art: VIENNA_ART,   dish: { name: 'schnitzel',  art: dishPlate('#e0b055', '#f2e04a') } },
  { id: 'rome',        name: 'Rome',         country: 'Italy',        lat: 41.903, lon: 12.496, art: ROME_ART,   dish: { name: 'carbonara',  art: dishPlate('#f0dba0', '#6b4a2b') } },
  { id: 'athens',      name: 'Athens',       country: 'Greece',       lat: 37.984, lon: 23.728, art: ATHENS_ART,   dish: { name: 'gyros',      art: dishRoll('#efd9a0', '#c0392b') } },
  { id: 'istanbul',    name: 'Istanbul',     country: 'Turkey',       lat: 41.008, lon: 28.978, art: ISTANBUL_ART,   dish: { name: 'simit',      art: dishPlate('#d98c2b', '#efd48a') } },
  { id: 'tbilisi',     name: 'Tbilisi',      country: 'Georgia',      lat: 41.715, lon: 44.827, art: TBILISI_ART,   dish: { name: 'khachapuri', art: dishPlate('#efc873', '#f2e04a') } },
  { id: 'dubai',       name: 'Dubai',        country: 'UAE',          lat: 25.205, lon: 55.271, art: DUBAI_ART,   mode: 'row', dish: { name: 'shawarma', art: dishRoll('#e8c27a', '#c0392b') } },
];


// ---------- The dish pictures ----------
// Each is drawn around the point (0, 0), about 40 wide. They are matched to the cities by dish name.
const plateBase = `<ellipse cx="0" cy="9" rx="20" ry="6.5" fill="#f4efe4"/><ellipse cx="0" cy="8" rx="16" ry="4.5" fill="#e6dfd0"/>`;
const DISH_ART = {
  'biryani': `${plateBase}
    <path d="M-15 8 Q-12 -10 0 -12 Q12 -10 15 8Z" fill="#e8b84a"/>
    <path d="M-9 4 Q-6 -6 0 -8 Q6 -6 9 4Z" fill="#f2d070" opacity="0.8"/>
    <g fill="#7a4a22"><rect x="-8" y="-2" width="6" height="5" rx="1.5"/><rect x="3" y="-4" width="6" height="5" rx="1.5"/></g>
    <g fill="#f4efe4"><ellipse cx="-1" cy="-9" rx="4.5" ry="3"/></g><circle cx="-1" cy="-9" r="1.6" fill="#f2b630"/>
    <path d="M9 -2 q4 -3 7 0 q-3 3 -7 0Z" fill="#4f8a3a"/>`,
  'kathi roll': `<rect x="-18" y="-7" width="34" height="14" rx="7" fill="#e8c27a" transform="rotate(-10)"/>
    <g stroke="#c99a4a" stroke-width="1.5" transform="rotate(-10)"><path d="M-10 -7 V7 M-2 -7 V7 M6 -7 V7"/></g>
    <g transform="rotate(-10)"><ellipse cx="16" cy="0" rx="3.5" ry="7" fill="#d9a65a"/><circle cx="16" cy="-2" r="2" fill="#8b3a8a"/><circle cx="16" cy="2" r="2" fill="#4f8a3a"/></g>
    <path d="M-16 5 L6 1 L8 12 L-14 15Z" fill="#cfd5d9"/><path d="M-16 5 L6 1" stroke="#aeb6bb" stroke-width="1"/>`,
  'hilsa curry': `<path d="M-18 -2 H18 Q16 15 0 15 Q-16 15 -18 -2Z" fill="#f1e7d6"/>
    <ellipse cx="0" cy="-2" rx="18" ry="6" fill="#d8742c"/>
    <path d="M-10 -3 Q0 -9 10 -3 Q0 1 -10 -3Z" fill="#c9ccd0"/><path d="M10 -3 L15 -7 V1Z" fill="#b5b9be"/><circle cx="-6" cy="-3.5" r="1" fill="#2b2b2b"/>
    <path d="M-12 1 q4 -1 7 2" stroke="#4f8a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  'mohinga': `<path d="M-18 -2 H18 Q16 15 0 15 Q-16 15 -18 -2Z" fill="#f1e7d6"/>
    <ellipse cx="0" cy="-2" rx="18" ry="6" fill="#d9a85a"/>
    <g stroke="#f5e6b8" stroke-width="1.4" fill="none"><path d="M-12 -2 q5 -4 10 0 q5 4 10 0 M-9 0 q5 -4 10 0 q5 4 9 0"/></g>
    <ellipse cx="9" cy="-5" rx="5" ry="3" fill="#f4efe4"/><circle cx="9" cy="-5" r="1.7" fill="#f2b630"/>
    <path d="M-14 -5 l5 -4 l4 5Z" fill="#c9843a"/><path d="M-4 -8 a6 6 0 0 1 6 5 Z" fill="#a8cf4a"/>`,
  'pad thai': `${plateBase}
    <path d="M-14 7 Q-15 -6 -2 -8 Q14 -8 14 5 Q8 9 -2 9Z" fill="#e8a23a"/>
    <g stroke="#f2c36a" stroke-width="1.6" fill="none"><path d="M-10 2 q4 -6 8 0 q4 6 8 0 M-8 -2 q4 -5 8 0 q4 5 8 0"/></g>
    <g fill="#7a4a22"><circle cx="-6" cy="-1" r="1.2"/><circle cx="3" cy="1" r="1.2"/><circle cx="7" cy="-3" r="1.2"/></g>
    <path d="M6 -6 q6 -3 9 2 q-3 4 -7 2Z" fill="#f08a7a"/>
    <path d="M10 5 a6 6 0 0 1 7 4 Z" fill="#a8cf4a"/>`,
  'fish amok': `<path d="M-16 -4 H16 L13 13 H-13Z" fill="#6f9a4a"/><path d="M-16 -4 H16" stroke="#58803a" stroke-width="2"/>
    <ellipse cx="0" cy="-4" rx="16" ry="4.5" fill="#e9b44c"/>
    <g fill="#c0392b"><circle cx="-6" cy="-5" r="1.6"/><circle cx="4" cy="-4" r="1.6"/><circle cx="9" cy="-6" r="1.3"/></g>
    <path d="M-4 -7 q3 -3 6 0" stroke="#f4efe4" stroke-width="1.6" fill="none"/>`,
  'pho': `<path d="M-19 -3 H19 Q17 16 0 16 Q-17 16 -19 -3Z" fill="#f4efe4"/>
    <path d="M-19 -3 H19" stroke="#d7cfbe" stroke-width="2"/>
    <ellipse cx="0" cy="-3" rx="19" ry="5.5" fill="#d3a76a"/>
    <path d="M-12 -3 q6 -4 12 0 q6 4 12 0" stroke="#f5e6c0" stroke-width="1.5" fill="none"/>
    <g fill="#d9776a"><ellipse cx="-6" cy="-5" rx="5" ry="2.4"/><ellipse cx="5" cy="-4" rx="5" ry="2.4"/></g>
    <g fill="#4f8a3a"><circle cx="-1" cy="-6" r="2"/><circle cx="10" cy="-6" r="1.6"/></g>
    <path d="M6 -8 L18 -20 M9 -8 L21 -18" stroke="#8a5a2b" stroke-width="1.6"/>`,
  'dumplings': `<ellipse cx="0" cy="10" rx="20" ry="6" fill="#c9a26a"/>
    <path d="M-20 10 V3 Q0 -3 20 3 V10Z" fill="#d9b67c"/><path d="M-20 3 Q0 9 20 3" stroke="#b78e55" stroke-width="1.6" fill="none"/>
    <g fill="#f8f4ea" stroke="#d9d0bc" stroke-width="1">
      <path d="M-14 0 Q-8 -14 0 0Z"/><path d="M-4 -2 Q4 -16 12 -2Z"/><path d="M6 0 Q12 -12 18 0Z"/>
    </g>
    <g stroke="#cfc6b0" stroke-width="1"><path d="M-12 -4 l1 -2 M-10 -6 l1 -2 M-2 -6 l1 -2 M0 -8 l1 -2"/></g>`,
  'bibimbap': `<path d="M-18 -2 H18 Q16 14 0 14 Q-16 14 -18 -2Z" fill="#3a3330"/>
    <ellipse cx="0" cy="-2" rx="18" ry="6" fill="#f4efe4"/>
    <path d="M-17 -3 Q-10 -9 -3 -6 L-3 0 Q-10 3 -17 -1Z" fill="#4f8a3a"/>
    <path d="M17 -3 Q10 -9 3 -6 L3 0 Q10 3 17 -1Z" fill="#e8892a"/>
    <path d="M-10 3 Q0 7 10 3 L8 0 Q0 3 -8 0Z" fill="#7a4a22"/>
    <ellipse cx="0" cy="-4" rx="5" ry="3.3" fill="#fbf7ee"/><circle cx="0" cy="-4" r="2.2" fill="#f2b630"/>
    <circle cx="0" cy="1" r="1.6" fill="#c0392b"/>`,
  'sushi': `<rect x="-20" y="8" width="40" height="5" rx="2" fill="#a8763a"/>
    <g><ellipse cx="-10" cy="5" rx="8" ry="4" fill="#f8f4ea"/><path d="M-18 4 Q-10 -6 -2 4 Q-10 6 -18 4Z" fill="#f08a5a"/></g>
    <g><ellipse cx="6" cy="5" rx="8" ry="4" fill="#f8f4ea"/><path d="M-2 4 Q6 -6 14 4 Q6 6 -2 4Z" fill="#f4a09a"/></g>
    <g><circle cx="17" cy="-3" r="6.5" fill="#2b3a2f"/><circle cx="17" cy="-3" r="4.5" fill="#f8f4ea"/><circle cx="17" cy="-3" r="1.8" fill="#e8795a"/></g>
    <circle cx="-4" cy="-6" r="0" fill="#000"/>`,
  'salmon': `${plateBase}
    <path d="M-15 6 Q-14 -8 2 -8 Q16 -8 15 6 Q0 10 -15 6Z" fill="#f08a6a"/>
    <path d="M-12 2 Q0 -4 12 2" stroke="#f7b8a0" stroke-width="1.6" fill="none"/><path d="M-12 -2 Q0 -8 12 -2" stroke="#f7b8a0" stroke-width="1.6" fill="none"/>
    <g stroke="#c4543a" stroke-width="1.4"><path d="M-8 -6 L-4 5 M2 -7 L6 5"/></g>
    <path d="M10 4 a6 6 0 0 1 7 4 Z" fill="#f2d84a"/><circle cx="-14" cy="6" r="2.4" fill="#4f8a3a"/>`,
  'fish tacos': `${plateBase}
    <path d="M-17 7 Q-13 -12 -2 -8 Q0 3 -2 7Z" fill="#e8c27a"/><path d="M1 7 Q3 -12 14 -8 Q18 3 15 7Z" fill="#e8c27a"/>
    <path d="M-15 0 q4 -6 9 -3 q-3 5 -9 3Z" fill="#7fb04a"/><path d="M3 -1 q6 -6 10 -3 q-3 5 -10 3Z" fill="#7fb04a"/>
    <g fill="#f4efe4"><rect x="-11" y="-2" width="5" height="4" rx="1"/><rect x="6" y="-3" width="5" height="4" rx="1"/></g>
    <circle cx="-3" cy="-4" r="1.5" fill="#d9472b"/><circle cx="10" cy="-5" r="1.5" fill="#d9472b"/>
    <path d="M-6 9 a5 5 0 0 1 6 3 Z" fill="#a8cf4a"/>`,
  'tacos al pastor': `${plateBase}
    <path d="M-16 8 Q-12 -14 0 -9 Q3 0 0 8Z" fill="#e8c27a"/>
    <path d="M-13 3 Q-8 -8 -2 -6 L0 4Z" fill="#e0742a"/>
    <path d="M2 8 Q4 -12 16 -8 Q19 2 16 8Z" fill="#e8c27a" opacity="0.9"/>
    <g fill="#f2d04a"><rect x="-9" y="-4" width="4" height="4"/><rect x="7" y="-5" width="4" height="4"/></g>
    <g fill="#4f8a3a"><circle cx="-4" cy="-6" r="1.4"/><circle cx="12" cy="-6" r="1.4"/></g>
    <g fill="#f4efe4"><circle cx="-6" cy="1" r="1.4"/><circle cx="9" cy="1" r="1.4"/></g>`,
  'sancocho': `<path d="M-18 -2 H18 Q16 15 0 15 Q-16 15 -18 -2Z" fill="#f1e7d6"/>
    <ellipse cx="0" cy="-2" rx="18" ry="6" fill="#d9b45a"/>
    <rect x="-12" y="-9" width="14" height="6" rx="3" fill="#f2c742"/><g fill="#e0a82e"><circle cx="-8" cy="-6" r="1"/><circle cx="-4" cy="-6" r="1"/></g>
    <path d="M4 -4 q4 -9 10 -4 q1 5 -4 5Z" fill="#c9843a"/><rect x="12" y="-9" width="6" height="3" rx="1.5" fill="#f4efe4" transform="rotate(-30 15 -7)"/>
    <g fill="#4f8a3a"><circle cx="-2" cy="-1" r="1.6"/><circle cx="-14" cy="-2" r="1.4"/></g>`,
  'arepa': `<ellipse cx="0" cy="8" rx="19" ry="5" fill="#d9a05b"/>
    <ellipse cx="0" cy="3" rx="19" ry="8" fill="#f2c873"/>
    <ellipse cx="0" cy="1" rx="14" ry="5" fill="#f6d890"/>
    <path d="M-17 4 Q0 12 17 4" stroke="#c99a4a" stroke-width="1.5" fill="none"/>
    <path d="M-10 -2 Q0 -8 12 -2 L10 3 Q0 7 -9 3Z" fill="#f6df5a"/>
    <path d="M-4 -10 q2 -4 0 -7 M4 -9 q2 -4 0 -7" stroke="#cfd5d9" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  'ceviche': `<path d="M-18 -4 H18 L10 8 H-10Z" fill="#e8f0f2" opacity="0.95"/><rect x="-2" y="8" width="4" height="6" fill="#d7dfe2"/><rect x="-10" y="14" width="20" height="2.5" rx="1" fill="#d7dfe2"/>
    <g fill="#f4efe4"><rect x="-12" y="-8" width="6" height="5" rx="1.5"/><rect x="-3" y="-10" width="6" height="5" rx="1.5"/><rect x="6" y="-8" width="6" height="5" rx="1.5"/></g>
    <g fill="#9a3a7a"><rect x="-8" y="-4" width="5" height="2" rx="1"/><rect x="2" y="-5" width="5" height="2" rx="1"/></g>
    <g fill="#f2c742"><circle cx="-14" cy="-6" r="1.4"/><circle cx="14" cy="-6" r="1.4"/></g>
    <path d="M11 -10 a7 7 0 0 1 8 5 Z" fill="#a8cf4a"/>`,
  'empanada': `<path d="M-18 8 Q-18 -12 0 -12 Q18 -12 18 8Z" fill="#e0a252"/>
    <path d="M-18 8 Q-18 -12 0 -12 Q18 -12 18 8Z" fill="none" stroke="#b97a32" stroke-width="2"/>
    <g stroke="#b97a32" stroke-width="1.6" stroke-linecap="round"><path d="M-17 7 l2 -3 M-14 7 l2 -3 M-11 7 l2 -3 M-8 7 l2 -3 M-5 7 l2 -3 M-2 7 l2 -3 M1 7 l2 -3 M4 7 l2 -3 M7 7 l2 -3 M10 7 l2 -3 M13 7 l2 -3"/></g>
    <path d="M-10 -4 Q-4 -9 2 -8" stroke="#f0c07a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <rect x="-18" y="9" width="36" height="2.5" rx="1" fill="#c9a26a"/>`,
  'asado': `<ellipse cx="0" cy="10" rx="21" ry="5.5" fill="#3a3330"/>
    <path d="M-16 8 Q-16 -9 -2 -8 Q16 -8 16 6 Q0 11 -16 8Z" fill="#8a4a2b"/>
    <path d="M-12 4 Q-2 -2 10 3" stroke="#5a2f1a" stroke-width="2.2" fill="none"/><path d="M-10 -3 Q0 -8 10 -3" stroke="#5a2f1a" stroke-width="2.2" fill="none"/>
    <rect x="9" y="-7" width="8" height="12" rx="3" fill="#e8d6b0" transform="rotate(20 13 -1)"/>
    <g fill="#4f8a3a"><circle cx="-14" cy="9" r="2.4"/><circle cx="-10" cy="11" r="2"/></g>`,
  'feijoada': `<path d="M-18 -2 H18 Q16 15 0 15 Q-16 15 -18 -2Z" fill="#3a3330"/>
    <ellipse cx="0" cy="-2" rx="18" ry="6" fill="#2b211c"/>
    <g fill="#8a4a2b"><rect x="-10" y="-5" width="8" height="4" rx="2"/><rect x="2" y="-4" width="8" height="4" rx="2"/></g>
    <g fill="#4a3328"><circle cx="-4" cy="0" r="1.6"/><circle cx="5" cy="1" r="1.6"/><circle cx="-13" cy="-2" r="1.6"/></g>
    <circle cx="14" cy="-9" r="6" fill="#f0a52a"/><circle cx="14" cy="-9" r="4" fill="none" stroke="#f8d27a" stroke-width="1"/>
    <path d="M14 -13 V-5 M10 -9 H18" stroke="#f8d27a" stroke-width="0.8"/>`,
  'thieboudienne': `<ellipse cx="0" cy="8" rx="21" ry="7" fill="#f4efe4"/>
    <path d="M-17 7 Q-16 -9 0 -9 Q16 -9 17 7 Q0 12 -17 7Z" fill="#e5894a"/>
    <path d="M-10 -1 Q-2 -7 8 -2 L10 4 Q0 7 -9 4Z" fill="#d8dce0"/><path d="M8 -2 L13 -5 V3Z" fill="#c4c9ce"/><circle cx="-6" cy="0" r="0.9" fill="#2b2b2b"/>
    <g fill="#f08a2a"><rect x="-15" y="-2" width="5" height="3" rx="1.4" transform="rotate(-25 -12 0)"/></g>
    <g fill="#4f8a3a"><circle cx="12" cy="-4" r="1.8"/><circle cx="-2" cy="-7" r="1.6"/></g>`,
  'jollof rice': `<path d="M-18 -2 H18 Q16 15 0 15 Q-16 15 -18 -2Z" fill="#f1e7d6"/>
    <path d="M-17 -2 Q-12 -14 0 -13 Q12 -14 17 -2Z" fill="#d9542c"/>
    <g fill="#e8742c"><circle cx="-8" cy="-6" r="1.4"/><circle cx="0" cy="-9" r="1.4"/><circle cx="8" cy="-6" r="1.4"/><circle cx="3" cy="-4" r="1.4"/></g>
    <g fill="#f2c742"><ellipse cx="-12" cy="-4" rx="4" ry="2.4"/><ellipse cx="12" cy="-4" rx="4" ry="2.4"/></g>
    <path d="M-2 -9 q4 -8 10 -4 q0 5 -5 6Z" fill="#c9843a"/>`,
  'couscous': `<ellipse cx="0" cy="12" rx="20" ry="5" fill="#c9672f"/>
    <path d="M-17 12 Q-17 2 -10 0 H10 Q17 2 17 12Z" fill="#d9793a"/>
    <path d="M-12 0 L0 -18 L12 0Z" fill="#b5532a"/><rect x="-2" y="-22" width="4" height="6" rx="2" fill="#8a3a1a"/>
    <path d="M-14 4 H14" stroke="#e8a060" stroke-width="1.6"/>
    <g stroke="#cfd5d9" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M-3 -25 q3 -4 0 -8 M4 -24 q3 -4 0 -7" opacity="0.0"/></g>`,
  'pastel de nata': `${plateBase}
    <g><path d="M-18 8 L-16 -1 H-4 L-2 8Z" fill="#e8b96a"/><ellipse cx="-10" cy="-1" rx="6" ry="2.4" fill="#f6d86a"/><circle cx="-12" cy="-1" r="1.3" fill="#a8541e"/><circle cx="-8" cy="-1.4" r="1.1" fill="#a8541e"/></g>
    <g><path d="M2 8 L4 -1 H16 L18 8Z" fill="#e8b96a"/><ellipse cx="10" cy="-1" rx="6" ry="2.4" fill="#f6d86a"/><circle cx="8" cy="-1" r="1.3" fill="#a8541e"/><circle cx="12" cy="-1.4" r="1.1" fill="#a8541e"/></g>
    <g stroke="#c99a4a" stroke-width="0.9"><path d="M-14 -1 V8 M-10 -1 V8 M-6 -1 V8 M6 -1 V8 M10 -1 V8 M14 -1 V8"/></g>`,
  'churros': `<g fill="#e0a252" stroke="#b97a32" stroke-width="1">
      <rect x="-20" y="-6" width="26" height="6" rx="3" transform="rotate(-18 -7 -3)"/>
      <rect x="-18" y="1" width="28" height="6" rx="3" transform="rotate(-6 -4 4)"/>
      <rect x="-16" y="8" width="26" height="6" rx="3" transform="rotate(6 -3 11)"/>
    </g>
    <g stroke="#f4e3c0" stroke-width="1.2"><path d="M-22 -8 l3 3 M-12 -12 l3 3 M-6 -2 l3 3 M-14 4 l3 3 M-8 12 l3 3"/></g>
    <path d="M10 2 H22 L20 14 H12Z" fill="#f4efe4"/><ellipse cx="16" cy="2" rx="6" ry="2" fill="#5a2f1a"/>`,
  'croissant': `<path d="M-20 6 Q-18 -12 -8 -10 Q-2 -16 6 -10 Q16 -12 20 6 Q14 2 8 8 Q0 2 -8 8 Q-14 2 -20 6Z" fill="#e0952f"/>
    <g fill="none" stroke="#b86f1c" stroke-width="1.6" stroke-linecap="round"><path d="M-12 -8 Q-10 0 -13 6 M-4 -11 Q-2 -2 -4 6 M6 -10 Q6 -2 4 6 M14 -7 Q12 0 14 5"/></g>
    <path d="M-14 -5 Q-4 -13 8 -9" stroke="#f2b868" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  'fish and chips': `<path d="M-20 12 L-16 -4 L18 -4 L20 12Z" fill="#e8e4d4"/>
    <g stroke="#a99f86" stroke-width="0.8"><path d="M-14 0 H12 M-15 4 H14 M-17 8 H16"/></g>
    <g fill="#f0c24a"><rect x="-12" y="-14" width="4" height="12" rx="1.2" transform="rotate(-12 -10 -8)"/><rect x="-6" y="-16" width="4" height="14" rx="1.2"/><rect x="0" y="-14" width="4" height="12" rx="1.2" transform="rotate(10 2 -8)"/></g>
    <path d="M-2 -2 Q8 -14 18 -4 Q10 4 -2 -2Z" fill="#d9942a"/><path d="M18 -4 L22 -9 V1Z" fill="#c4811f"/>
    <path d="M-16 -6 a6 6 0 0 1 7 4 Z" fill="#f2d84a"/>`,
  'stroopwafel': `<ellipse cx="0" cy="8" rx="19" ry="5" fill="#a8763a"/>
    <ellipse cx="0" cy="3" rx="19" ry="8" fill="#d9a05b"/>
    <g stroke="#a8763a" stroke-width="1.2"><path d="M-12 -3 L10 9 M-6 -5 L16 7 M-16 1 L4 11 M2 -6 L18 3 M-14 6 L-4 -5 M-6 8 L6 -6 M2 9 L14 -3 M-10 9 L-9 8"/></g>
    <path d="M-19 3 Q0 11 19 3" stroke="#8a5a2b" stroke-width="1.5" fill="none"/>
    <path d="M6 -8 L14 -2" stroke="#7a4a22" stroke-width="2.4" stroke-linecap="round" opacity="0.0"/>`,
  'currywurst': `<path d="M-19 4 H19 L16 14 H-16Z" fill="#e8e4d4"/>
    <g fill="#c4642a"><rect x="-15" y="-6" width="9" height="10" rx="4.5"/><rect x="-5" y="-8" width="9" height="12" rx="4.5"/><rect x="5" y="-6" width="9" height="10" rx="4.5"/></g>
    <g fill="#c0392b"><path d="M-14 -4 q5 -4 9 0 q-4 4 -9 0Z"/><path d="M-4 -6 q5 -4 9 0 q-4 4 -9 0Z"/><path d="M6 -4 q5 -4 9 0 q-4 4 -9 0Z"/></g>
    <g fill="#f2c742"><circle cx="-10" cy="-2" r="0.9"/><circle cx="0" cy="-4" r="0.9"/><circle cx="10" cy="-2" r="0.9"/><circle cx="-2" cy="1" r="0.9"/></g>
    <path d="M12 -14 L18 -2 M15 -15 L21 -4" stroke="#8a8f94" stroke-width="1.6"/>`,
  'schnitzel': `${plateBase}
    <path d="M-17 6 Q-18 -9 -4 -10 Q12 -12 17 -2 Q18 8 2 10 Q-12 11 -17 6Z" fill="#e0a845"/>
    <g fill="#f0c670"><circle cx="-8" cy="-2" r="1.6"/><circle cx="2" cy="-6" r="1.6"/><circle cx="9" cy="1" r="1.6"/><circle cx="-2" cy="4" r="1.6"/><circle cx="-12" cy="3" r="1.3"/></g>
    <g fill="#b97a2a"><circle cx="-4" cy="-5" r="1.2"/><circle cx="6" cy="-2" r="1.2"/><circle cx="1" cy="2" r="1.2"/></g>
    <circle cx="14" cy="6" r="5.5" fill="#f2d84a"/><circle cx="14" cy="6" r="3.8" fill="none" stroke="#f8ec8a" stroke-width="1"/>
    <g fill="#4f8a3a"><circle cx="-17" cy="8" r="1.8"/><circle cx="-14" cy="10" r="1.5"/></g>`,
  'carbonara': `${plateBase}
    <path d="M-15 6 Q-16 -8 0 -9 Q16 -8 15 6 Q0 10 -15 6Z" fill="#f0dba0"/>
    <g stroke="#d9bf78" stroke-width="1.6" fill="none"><path d="M-11 2 q5 -8 11 -2 q6 6 11 -2 M-9 -3 q5 -5 9 0 q5 5 9 -1"/></g>
    <g fill="#9a4a3a"><rect x="-8" y="-4" width="4" height="3" rx="1"/><rect x="2" y="0" width="4" height="3" rx="1"/><rect x="6" y="-5" width="4" height="3" rx="1"/></g>
    <g fill="#2b2b2b"><circle cx="-2" cy="-2" r="0.8"/><circle cx="5" cy="3" r="0.8"/><circle cx="-6" cy="3" r="0.8"/><circle cx="1" cy="-6" r="0.8"/></g>
    <path d="M12 -8 L19 -18 M15 -7 L22 -17" stroke="#8a8f94" stroke-width="1.6"/>`,
  'gyros': `<path d="M-18 8 Q-18 -12 -2 -12 Q14 -12 18 8Z" fill="#f0d9a0"/>
    <path d="M-18 8 Q-18 -12 -2 -12 Q14 -12 18 8Z" fill="none" stroke="#c9a85a" stroke-width="1.6"/>
    <g fill="#c4642a"><rect x="-12" y="-6" width="8" height="5" rx="2"/><rect x="0" y="-8" width="8" height="5" rx="2"/></g>
    <g fill="#d9472b"><circle cx="-14" cy="-4" r="2.4"/><circle cx="12" cy="-3" r="2.4"/></g>
    <path d="M-8 -12 Q-4 -18 0 -12 Q4 -18 8 -12 Q4 -8 0 -9 Q-4 -8 -8 -12Z" fill="#f8f4ea"/>
    <g fill="#8b3a8a"><rect x="-6" y="-2" width="6" height="2" rx="1"/></g>
    <path d="M-16 9 L-12 16 H12 L16 9Z" fill="#e8e4d4"/>`,
  'simit': `<ellipse cx="0" cy="3" rx="19" ry="12" fill="#c9792a"/>
    <ellipse cx="0" cy="3" rx="19" ry="12" fill="none" stroke="#a85f1c" stroke-width="1.4"/>
    <ellipse cx="0" cy="3" rx="8" ry="4.5" fill="#f4f0e4" opacity="0.0"/>
    <ellipse cx="0" cy="3" rx="7" ry="4" fill="#dfe6e8"/>
    <g fill="#f6e3a8"><circle cx="-14" cy="-3" r="1"/><circle cx="-8" cy="-7" r="1"/><circle cx="0" cy="-8" r="1"/><circle cx="8" cy="-7" r="1"/><circle cx="14" cy="-3" r="1"/>
      <circle cx="-16" cy="4" r="1"/><circle cx="16" cy="4" r="1"/><circle cx="-12" cy="10" r="1"/><circle cx="0" cy="13" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="-4" cy="-4" r="0.9"/><circle cx="5" cy="-4" r="0.9"/></g>`,
  'khachapuri': `<path d="M-21 3 Q-8 -14 0 -14 Q8 -14 21 3 Q8 16 0 16 Q-8 16 -21 3Z" fill="#d9944a"/>
    <path d="M-21 3 Q-8 -14 0 -14 Q8 -14 21 3 Q8 16 0 16 Q-8 16 -21 3Z" fill="none" stroke="#b86f2a" stroke-width="1.4"/>
    <ellipse cx="0" cy="3" rx="14" ry="8" fill="#f6df6a"/>
    <ellipse cx="0" cy="3" rx="6" ry="4.4" fill="#f4efe4"/><circle cx="0" cy="3" r="3.2" fill="#f2a31a"/>
    <rect x="7" y="0" width="5" height="4" rx="1" fill="#fbe9a0"/>`,
  'shawarma': `<rect x="-17" y="-8" width="30" height="16" rx="8" fill="#e8c27a" transform="rotate(-24)"/>
    <g transform="rotate(-24)"><ellipse cx="13" cy="0" rx="4" ry="8" fill="#d9a65a"/><circle cx="13" cy="-3" r="2" fill="#c4642a"/><circle cx="13" cy="2" r="2" fill="#f4efe4"/><circle cx="14" cy="-0.5" r="1.4" fill="#e87a9a"/></g>
    <g stroke="#c99a4a" stroke-width="1.4" transform="rotate(-24)"><path d="M-8 -8 V8 M0 -8 V8"/></g>
    <path d="M-14 6 L-2 10 L-6 18 L-18 14Z" fill="#cfd5d9"/>`,
};
// Use these pictures for the matching dishes
CITIES.forEach(c => { if (DISH_ART[c.dish.name]) c.dish.art = DISH_ART[c.dish.name]; });

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

// ---------- How the locals greet him when he arrives ----------
const HELLO = {
  mumbai: 'Namaste!', pune: 'Namaskar!', hyderabad: 'Adaab!', kolkata: 'Nomoshkar!', dhaka: 'Shagotom!',
  yangon: 'Mingalaba!', bangkok: 'Sawasdee!', phnompenh: 'Suosdei!', hanoi: 'Xin chào!', beijing: 'Nǐ hǎo!',
  seoul: 'Annyeong!', tokyo: 'Irasshai!', vancouver: 'Welcome!', losangeles: 'Hey there!', mexicocity: '¡Bienvenido!',
  panama: '¡Hola!', bogota: '¡Bienvenido!', lima: '¡Hola, amigo!', santiago: '¡Bienvenido!', buenosaires: '¡Che, hola!',
  rio: 'Bem-vindo!', dakar: 'Nanga def!', accra: 'Akwaaba!', casablanca: 'Marhaba!', lisbon: 'Bem-vindo!',
  madrid: '¡Hola!', paris: 'Bonjour!', london: 'Hello, mate!', amsterdam: 'Welkom!', berlin: 'Willkommen!',
  vienna: 'Servus!', rome: 'Benvenuto!', athens: 'Yia sou!', istanbul: 'Hoş geldin!', tbilisi: 'Gamarjoba!', dubai: 'Ahlan!',
};
CITIES.forEach(c => { c.hello = HELLO[c.id] || 'Welcome!'; });
