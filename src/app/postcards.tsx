import React from "react";

/*
  FUSION STYLE: Alan Becker × Zhu Zhiqiang (Xiao Xiao) × STIK
  FORMAT: 9:16 vertical (Instagram Reels inside phone frame)
  viewBox: 0 0 270 480

  Every figure has:
  • STIK-style large round head (r≈22-28) with two dot eyes
  • Becker-style dynamic stick body interacting with digital elements
  • Xiao Xiao-style motion lines, speed trails, impact effects

  Cards 01-10: Becker-dominant — digital interaction, creative energy
  Cards 11-20: Xiao Xiao-dominant — kinetic action, martial arts fluidity
  Cards 21-30: STIK-dominant — emotional postures, community warmth
*/

const S = "#1d1d1f";
const SW = "3";
const SWt = "1.8";
const SWh = "3.5";

/* ── STIK-style head with dot eyes ── */
const Head = ({ cx, cy, r = 22 }: { cx: number; cy: number; r?: number }) => (
  <>
    <circle cx={cx} cy={cy} r={r} stroke={S} strokeWidth={SW} fill="none" />
    <circle cx={cx - r * 0.28} cy={cy - r * 0.08} r={2.2} fill={S} />
    <circle cx={cx + r * 0.28} cy={cy - r * 0.08} r={2.2} fill={S} />
  </>
);

/* ── Xiao Xiao motion lines ── */
const SpeedLines = ({ x, y, dir = "left", count = 3 }: { x: number; y: number; dir?: "left" | "right" | "up" | "down"; count?: number }) => {
  const lines = [];
  for (let i = 0; i < count; i++) {
    const offset = i * 7;
    const len = 14 + i * 5;
    if (dir === "left") lines.push(<path key={i} d={`M${x - offset} ${y + i * 4}L${x - offset - len} ${y + i * 4}`} stroke={S} strokeWidth="1.5" opacity={1 - i * 0.22} />);
    if (dir === "right") lines.push(<path key={i} d={`M${x + offset} ${y + i * 4}L${x + offset + len} ${y + i * 4}`} stroke={S} strokeWidth="1.5" opacity={1 - i * 0.22} />);
    if (dir === "up") lines.push(<path key={i} d={`M${x + i * 4} ${y - offset}L${x + i * 4} ${y - offset - len}`} stroke={S} strokeWidth="1.5" opacity={1 - i * 0.22} />);
    if (dir === "down") lines.push(<path key={i} d={`M${x + i * 4} ${y + offset}L${x + i * 4} ${y + offset + len}`} stroke={S} strokeWidth="1.5" opacity={1 - i * 0.22} />);
  }
  return <>{lines}</>;
};

/* ── Becker-style cursor arrow ── */
const Cursor = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <path d="M0 0L0 18L5 13L10 20L13 18L8 11L14 11Z" stroke={S} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
  </g>
);

/* ── Impact starburst (Xiao Xiao) ── */
const Impact = ({ cx, cy, r = 10 }: { cx: number; cy: number; r?: number }) => (
  <g>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = cx + Math.cos(rad) * (r * 0.35);
      const y1 = cy + Math.sin(rad) * (r * 0.35);
      const x2 = cx + Math.cos(rad) * r;
      const y2 = cy + Math.sin(rad) * r;
      return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={S} strokeWidth="1.8" />;
    })}
  </g>
);

export const POSTCARDS: { label: string; sketch: React.ReactNode }[] = [

  /* ═══════════════════════════════════════════════
     01–10: BECKER-DOMINANT
     ═══════════════════════════════════════════════ */

  /* 01 */ {
    label: "Animator vs. Code",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure fighting a giant cursor */}
        <Head cx={90} cy={140} r={24} />
        <path d="M90 164L90 240" stroke={S} strokeWidth={SW} />
        <path d="M90 195L55 170" stroke={S} strokeWidth={SW} />
        <path d="M90 195L135 180" stroke={S} strokeWidth={SW} />
        <path d="M90 240L65 295" stroke={S} strokeWidth={SW} />
        <path d="M90 240L120 290" stroke={S} strokeWidth={SW} />
        {/* Giant cursor */}
        <Cursor x={155} y={100} scale={4} />
        {/* Impact */}
        <Impact cx={140} cy={180} r={16} />
        {/* Speed lines */}
        <SpeedLines x={50} y={145} dir="left" count={5} />
        {/* Code brackets floating */}
        <text x="170" y="320" fontSize="32" fontFamily="monospace" stroke={S} strokeWidth="1.2" fill="none">{"{ }"}</text>
        <text x="30" y="380" fontSize="24" fontFamily="monospace" stroke={S} strokeWidth="1" fill="none">{"</ >"}</text>
        {/* Binary rain */}
        <text x="200" y="400" fontSize="14" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none" opacity="0.3">01010</text>
        <text x="40" y="430" fontSize="14" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none" opacity="0.3">11001</text>
      </svg>
    ),
  },

  /* 02 */ {
    label: "Pair Programming",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Two figures at shared monitor */}
        <Head cx={70} cy={160} r={22} />
        <path d="M70 182L70 255" stroke={S} strokeWidth={SW} />
        <path d="M70 210L95 230" stroke={S} strokeWidth={SW} />
        <path d="M70 210L45 225" stroke={S} strokeWidth={SW} />
        <path d="M70 255L50 310M70 255L90 310" stroke={S} strokeWidth={SW} />
        <Head cx={200} cy={155} r={22} />
        <path d="M200 177L198 255" stroke={S} strokeWidth={SW} />
        <path d="M199 210L175 228" stroke={S} strokeWidth={SW} />
        <path d="M199 210L225 200" stroke={S} strokeWidth={SW} />
        <path d="M198 255L180 310M198 255L218 310" stroke={S} strokeWidth={SW} />
        {/* Shared monitor */}
        <rect x="85" y="80" width="100" height="65" rx="4" stroke={S} strokeWidth={SW} fill="none" />
        <path d="M100 100L112 112L100 124" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M122 100L160 100M122 112L155 112M122 124L148 124" stroke={S} strokeWidth="1.2" />
        <path d="M135 145L135 160M120 160L150 160" stroke={S} strokeWidth={SWt} />
        {/* WiFi */}
        <path d="M130 55Q135 48 140 55M124 46Q135 36 146 46" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Coffee cups */}
        <path d="M30 350Q30 340 50 340Q70 340 70 350L68 380Q65 390 50 390Q35 390 32 380Z" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M200 345Q200 335 220 335Q240 335 240 345L238 375Q235 385 220 385Q205 385 202 375Z" stroke={S} strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },

  /* 03 */ {
    label: "Hackathon Frenzy",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Airborne figure above laptop */}
        <Head cx={135} cy={80} r={24} />
        <path d="M135 104L135 175" stroke={S} strokeWidth={SW} />
        <path d="M135 135L100 110" stroke={S} strokeWidth={SW} />
        <path d="M135 135L170 110" stroke={S} strokeWidth={SW} />
        <path d="M135 175L105 205" stroke={S} strokeWidth={SW} />
        <path d="M135 175L165 205" stroke={S} strokeWidth={SW} />
        {/* Speed lines upward */}
        <SpeedLines x={135} y={210} dir="down" count={5} />
        {/* Laptop below */}
        <rect x="65" y="260" width="140" height="90" rx="5" stroke={S} strokeWidth={SW} fill="none" />
        <path d="M80 280L95 295L80 310" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M110 280L170 280M110 295L160 295M110 310L180 310" stroke={S} strokeWidth="1.2" />
        {/* Timer */}
        <circle cx="225" cy="60" r="20" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M225 45L225 60L236 68" stroke={S} strokeWidth="1.5" />
        {/* Floating code particles */}
        <text x="20" y="120" fontSize="16" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">01</text>
        <text x="220" y="100" fontSize="16" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">10</text>
        <text x="30" y="400" fontSize="18" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">{"{ }"}</text>
        <text x="195" y="410" fontSize="18" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">{"( )"}</text>
      </svg>
    ),
  },

  /* 04 */ {
    label: "Debugging Battle",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure battling a giant bug */}
        <Head cx={65} cy={140} r={22} />
        <path d="M65 162L65 235" stroke={S} strokeWidth={SW} />
        <path d="M65 195L35 175" stroke={S} strokeWidth={SW} />
        <path d="M65 195L105 180" stroke={S} strokeWidth={SW} />
        <path d="M65 235L45 290M65 235L85 290" stroke={S} strokeWidth={SW} />
        <SpeedLines x={30} y={145} dir="left" count={4} />
        {/* Giant bug */}
        <ellipse cx={175} cy={190} rx={50} ry={35} stroke={S} strokeWidth={SW} fill="none" />
        <circle cx="158" cy="180" r="4" fill={S} />
        <circle cx="182" cy="180" r="4" fill={S} />
        <path d="M130 170L108 145M130 190L105 195M130 210L108 240" stroke={S} strokeWidth={SWt} />
        <path d="M220 170L242 145M220 190L245 195M220 210L242 240" stroke={S} strokeWidth={SWt} />
        <path d="M158 155L140 130M182 155L200 130" stroke={S} strokeWidth={SWt} />
        <circle cx="140" cy="127" r="4" stroke={S} strokeWidth="1.2" fill="none" />
        <circle cx="200" cy="127" r="4" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Impact */}
        <Impact cx={120} cy={180} r={14} />
        {/* Error text */}
        <rect x="60" y="340" width="150" height="40" rx="4" stroke={S} strokeWidth="1.2" fill="none" strokeDasharray="4 3" />
        <text x="90" y="366" fontSize="16" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">ERROR 500</text>
      </svg>
    ),
  },

  /* 05 */ {
    label: "Creative Explosion",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure with arms spread, creating outward */}
        <Head cx={135} cy={130} r={26} />
        <path d="M135 156L135 240" stroke={S} strokeWidth={SWh} />
        <path d="M135 190L75 150" stroke={S} strokeWidth={SW} />
        <path d="M135 190L195 150" stroke={S} strokeWidth={SW} />
        <path d="M135 240L110 300M135 240L160 300" stroke={S} strokeWidth={SW} />
        {/* Explosion radiating */}
        <SpeedLines x={65} y={148} dir="left" count={5} />
        <SpeedLines x={205} y={148} dir="right" count={5} />
        {/* Geometric shapes flying */}
        <rect x="20" y="200" width="24" height="24" stroke={S} strokeWidth="1.5" fill="none" transform="rotate(20 32 212)" />
        <circle cx="235" cy="210" r="14" stroke={S} strokeWidth="1.5" fill="none" />
        <polygon points="245,80 255,55 265,80" stroke={S} strokeWidth="1.5" fill="none" />
        <polygon points="20,100 10,120 30,120" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Code fragments */}
        <text x="15" y="65" fontSize="20" fontFamily="monospace" stroke={S} strokeWidth="1" fill="none">{"<>"}</text>
        <text x="215" y="60" fontSize="20" fontFamily="monospace" stroke={S} strokeWidth="1" fill="none">{"/>"}</text>
        {/* Cursors */}
        <Cursor x={20} y={330} scale={2} />
        <Cursor x={210} y={340} scale={2} />
        {/* Energy circle */}
        <circle cx="135" cy="190" r="45" stroke={S} strokeWidth="0.8" fill="none" strokeDasharray="5 5" />
      </svg>
    ),
  },

  /* 06 */ {
    label: "Build & Ship",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure building tower of blocks */}
        <Head cx={85} cy={170} r={22} />
        <path d="M85 192L85 265" stroke={S} strokeWidth={SW} />
        <path d="M85 225L120 205" stroke={S} strokeWidth={SW} />
        <path d="M85 225L55 240" stroke={S} strokeWidth={SW} />
        <path d="M85 265L65 320M85 265L105 320" stroke={S} strokeWidth={SW} />
        {/* Block tower */}
        <rect x="145" y="280" width="55" height="35" stroke={S} strokeWidth={SW} fill="none" />
        <rect x="150" y="245" width="48" height="35" stroke={S} strokeWidth={SW} fill="none" />
        <rect x="153" y="210" width="42" height="35" stroke={S} strokeWidth={SW} fill="none" />
        {/* Block being carried */}
        <rect x="110" y="155" width="38" height="28" stroke={S} strokeWidth={SW} fill="none" />
        <SpeedLines x={110} y={175} dir="up" count={3} />
        {/* Labels on blocks */}
        <text x="155" y="303" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">v1.0</text>
        <text x="158" y="268" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">API</text>
        <text x="162" y="233" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">UI</text>
        {/* Rocket */}
        <path d="M210 60L220 30L230 60L226 60L226 95L214 95L214 60Z" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M216 95L220 110M224 95L228 110" stroke={S} strokeWidth="1.2" />
        <SpeedLines x={220} y={112} dir="down" count={4} />
      </svg>
    ),
  },

  /* 07 */ {
    label: "Ctrl+Z Panic",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure running from error windows */}
        <Head cx={70} cy={150} r={22} />
        <path d="M70 172L75 245" stroke={S} strokeWidth={SW} />
        <path d="M73 205L45 185" stroke={S} strokeWidth={SW} />
        <path d="M73 205L100 190" stroke={S} strokeWidth={SW} />
        <path d="M75 245L48 275" stroke={S} strokeWidth={SW} />
        <path d="M75 245L100 268" stroke={S} strokeWidth={SW} />
        <SpeedLines x={40} y={155} dir="left" count={6} />
        {/* Sweat */}
        <circle cx="95" cy="140" r="3" stroke={S} strokeWidth="1.2" fill="none" />
        <circle cx="102" cy="130" r="2.5" stroke={S} strokeWidth="1" fill="none" />
        {/* Cascading error windows */}
        <rect x="130" y="80" width="95" height="55" rx="4" stroke={S} strokeWidth={SWt} fill="none" />
        <text x="145" y="115" fontSize="14" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">ERROR</text>
        <path d="M214 88L218 84M218 88L214 84" stroke={S} strokeWidth="1.8" />
        <rect x="145" y="115" width="95" height="55" rx="4" stroke={S} strokeWidth={SWt} fill="none" />
        <text x="160" y="150" fontSize="14" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">CRASH</text>
        <rect x="155" y="150" width="95" height="55" rx="4" stroke={S} strokeWidth={SWt} fill="none" />
        <text x="170" y="185" fontSize="14" fontFamily="monospace" stroke={S} strokeWidth="0.8" fill="none">PANIC</text>
        {/* Ground */}
        <path d="M10 320L260 320" stroke={S} strokeWidth="1.2" strokeDasharray="8 5" />
      </svg>
    ),
  },

  /* 08 */ {
    label: "Drag & Drop Life",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Giant cursor dragging figure */}
        <Cursor x={100} y={40} scale={4} />
        {/* Figure dangling */}
        <Head cx={135} cy={165} r={20} />
        <path d="M135 185L135 260" stroke={S} strokeWidth={SW} />
        <path d="M135 210L112 190" stroke={S} strokeWidth={SW} />
        <path d="M135 210L158 190" stroke={S} strokeWidth={SW} />
        <path d="M135 260L115 300" stroke={S} strokeWidth={SW} />
        <path d="M135 260L155 300" stroke={S} strokeWidth={SW} />
        <SpeedLines x={115} y={230} dir="left" count={3} />
        {/* UI elements in background */}
        <rect x="15" y="90" width="60" height="40" rx="3" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M22 105L50 105M22 118L55 118" stroke={S} strokeWidth="0.8" />
        <rect x="195" y="260" width="55" height="45" rx="3" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M202 278L230 278M202 290L240 290" stroke={S} strokeWidth="0.8" />
        {/* Trash can below */}
        <path d="M95 370L95 420L175 420L175 370" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M88 370L182 370" stroke={S} strokeWidth={SWt} />
        <path d="M115 365L115 358L155 358L155 365" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M115 380L115 410M135 380L135 410M155 380L155 410" stroke={S} strokeWidth="1" />
      </svg>
    ),
  },

  /* 09 */ {
    label: "Git Push Force",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure doing hadouken push */}
        <Head cx={60} cy={140} r={22} />
        <path d="M60 162L65 240" stroke={S} strokeWidth={SW} />
        <path d="M63 195L105 178" stroke={S} strokeWidth={SW} />
        <path d="M63 190L100 170" stroke={S} strokeWidth={SW} />
        <path d="M65 240L45 295M65 240L85 290" stroke={S} strokeWidth={SW} />
        {/* Energy blast */}
        <circle cx="140" cy="172" r="20" stroke={S} strokeWidth={SW} fill="none" />
        <circle cx="140" cy="172" r="10" stroke={S} strokeWidth="1.5" fill="none" />
        <SpeedLines x={165} y={160} dir="right" count={6} />
        {/* Arrow pushing */}
        <path d="M175 172L245 172" stroke={S} strokeWidth={SWh} />
        <path d="M230 158L250 172L230 186" stroke={S} strokeWidth={SW} fill="none" />
        {/* Git text */}
        <text x="80" y="110" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">git push --force</text>
        {/* Server rack */}
        <rect x="200" y="320" width="40" height="80" rx="3" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M208 335L232 335M208 350L232 350M208 365L232 365M208 380L232 380" stroke={S} strokeWidth="1" />
        {/* Ground vibration */}
        <path d="M20 430Q60 424 100 430Q140 436 180 430Q220 424 260 430" stroke={S} strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },

  /* 10 */ {
    label: "Deploy to Prod",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure riding rocket upward */}
        <path d="M135 280L122 315L116 308L96 345L135 330L174 345L154 308L148 315Z" stroke={S} strokeWidth={SW} fill="none" />
        <path d="M122 315L135 240L148 315" stroke={S} strokeWidth={SW} fill="none" />
        <circle cx="135" cy="290" r="8" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Figure on top */}
        <Head cx={135} cy={155} r={20} />
        <path d="M135 175L135 235" stroke={S} strokeWidth={SW} />
        <path d="M135 200L110 185" stroke={S} strokeWidth={SW} />
        <path d="M135 200L160 180" stroke={S} strokeWidth={SW} />
        {/* Flame */}
        <path d="M110 345L135 400L160 345" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M118 350L135 385L152 350" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Speed lines down */}
        <SpeedLines x={100} y={360} dir="down" count={5} />
        <SpeedLines x={165} y={360} dir="down" count={5} />
        {/* Clouds */}
        <path d="M20 340Q35 328 50 340Q65 328 80 340" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M190 330Q205 318 220 330Q235 318 250 330" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Terminal text */}
        <text x="30" y="60" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">$ npm run deploy</text>
        <text x="30" y="80" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">✓ deployed</text>
      </svg>
    ),
  },

  /* ═══════════════════════════════════════════════
     11–20: XIAO XIAO-DOMINANT
     ═══════════════════════════════════════════════ */

  /* 11 */ {
    label: "Knowledge Kung Fu",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Flying kick into book stack */}
        <Head cx={75} cy={130} r={22} />
        <path d="M75 152L80 220" stroke={S} strokeWidth={SW} />
        <path d="M78 180L50 160" stroke={S} strokeWidth={SW} />
        <path d="M78 180L110 165" stroke={S} strokeWidth={SW} />
        <path d="M80 220L60 250" stroke={S} strokeWidth={SW} />
        <path d="M80 220L140 200" stroke={S} strokeWidth={SW} /> {/* FLYING KICK */}
        <SpeedLines x={45} y={135} dir="left" count={6} />
        {/* Impact on books */}
        <Impact cx={155} cy={200} r={18} />
        {/* Books flying */}
        <rect x="165" y="145" width="48" height="12" stroke={S} strokeWidth="1.5" fill="none" transform="rotate(-25 189 151)" />
        <rect x="175" y="185" width="48" height="12" stroke={S} strokeWidth="1.5" fill="none" transform="rotate(18 199 191)" />
        <rect x="170" y="230" width="48" height="12" stroke={S} strokeWidth="1.5" fill="none" transform="rotate(-12 194 236)" />
        <rect x="185" y="115" width="40" height="12" stroke={S} strokeWidth="1.5" fill="none" transform="rotate(-38 205 121)" />
        {/* Pages scattering */}
        <path d="M220 160Q232 148 244 160" stroke={S} strokeWidth="1" fill="none" />
        <path d="M230 195Q240 185 252 195" stroke={S} strokeWidth="1" fill="none" />
        <path d="M225 240Q235 230 248 240" stroke={S} strokeWidth="1" fill="none" />
        {/* Ground */}
        <path d="M15 340L255 340" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 12 */ {
    label: "Idea Lightning",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure catching lightning */}
        <Head cx={135} cy={200} r={26} />
        <path d="M135 226L135 310" stroke={S} strokeWidth={SWh} />
        <path d="M135 260L100 235" stroke={S} strokeWidth={SW} />
        <path d="M135 260L170 230" stroke={S} strokeWidth={SW} />
        <path d="M135 310L110 370M135 310L160 370" stroke={S} strokeWidth={SW} />
        {/* Lightning bolt */}
        <path d="M142 30L120 90L148 90L108 160L150 160L125 200" stroke={S} strokeWidth={SWh} fill="none" strokeLinejoin="bevel" />
        {/* Energy circles */}
        <circle cx="135" cy="200" r="50" stroke={S} strokeWidth="0.8" fill="none" strokeDasharray="6 6" />
        <circle cx="135" cy="200" r="70" stroke={S} strokeWidth="0.5" fill="none" strokeDasharray="4 8" />
        {/* Speed particles */}
        <SpeedLines x={90} y={210} dir="left" count={4} />
        <SpeedLines x={180} y={210} dir="right" count={4} />
        {/* Small zaps */}
        <path d="M35 80L42 100L32 100L40 120" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M230 70L237 90L227 90L235 110" stroke={S} strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },

  /* 13 */ {
    label: "Sprint Standup",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* 3 figures in formation */}
        {/* Figure 1 */}
        <Head cx={45} cy={165} r={18} />
        <path d="M45 183L45 245" stroke={S} strokeWidth={SW} />
        <path d="M45 210L25 195M45 210L70 198" stroke={S} strokeWidth={SW} />
        <path d="M45 245L30 290M45 245L60 290" stroke={S} strokeWidth={SW} />
        {/* Figure 2 — center, bigger */}
        <Head cx={135} cy={145} r={22} />
        <path d="M135 167L135 240" stroke={S} strokeWidth={SW} />
        <path d="M135 195L105 170M135 195L165 170" stroke={S} strokeWidth={SW} />
        <path d="M135 240L115 300M135 240L155 300" stroke={S} strokeWidth={SW} />
        {/* Figure 3 */}
        <Head cx={225} cy={165} r={18} />
        <path d="M225 183L225 245" stroke={S} strokeWidth={SW} />
        <path d="M225 210L200 198M225 210L250 195" stroke={S} strokeWidth={SW} />
        <path d="M225 245L210 290M225 245L240 290" stroke={S} strokeWidth={SW} />
        {/* Energy connections */}
        <path d="M70 198L105 175" stroke={S} strokeWidth="1.2" strokeDasharray="5 4" />
        <path d="M165 175L200 198" stroke={S} strokeWidth="1.2" strokeDasharray="5 4" />
        {/* Kanban board above */}
        <rect x="55" y="40" width="160" height="55" rx="3" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M108 40L108 95M162 40L162 95" stroke={S} strokeWidth="1" />
        <rect x="65" y="50" width="32" height="10" rx="2" stroke={S} strokeWidth="0.8" fill="none" />
        <rect x="118" y="55" width="32" height="10" rx="2" stroke={S} strokeWidth="0.8" fill="none" />
        <rect x="172" y="50" width="32" height="10" rx="2" stroke={S} strokeWidth="0.8" fill="none" />
        {/* Ground */}
        <path d="M10 350L260 350" stroke={S} strokeWidth="1.5" />
      </svg>
    ),
  },

  /* 14 */ {
    label: "Brainstorm Clash",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Two figures fist-clashing */}
        <Head cx={50} cy={155} r={20} />
        <path d="M50 175L55 245" stroke={S} strokeWidth={SW} />
        <path d="M53 208L95 185" stroke={S} strokeWidth={SW} />
        <path d="M53 208L28 220" stroke={S} strokeWidth={SW} />
        <path d="M55 245L35 300M55 245L75 295" stroke={S} strokeWidth={SW} />
        <SpeedLines x={25} y={158} dir="left" count={5} />
        <Head cx={220} cy={158} r={20} />
        <path d="M220 178L215 245" stroke={S} strokeWidth={SW} />
        <path d="M217 208L175 185" stroke={S} strokeWidth={SW} />
        <path d="M217 208L242 220" stroke={S} strokeWidth={SW} />
        <path d="M215 245L195 300M215 245L235 295" stroke={S} strokeWidth={SW} />
        <SpeedLines x={245} y={158} dir="right" count={5} />
        {/* CLASH */}
        <Impact cx={135} cy={185} r={25} />
        {/* Lightbulb from impact */}
        <path d="M128 80Q128 55 135 55Q142 55 142 80Q142 90 135 95Q128 90 128 80Z" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M130 100L140 100M131 106L139 106" stroke={S} strokeWidth="1.2" />
        <path d="M120 50L115 38M150 50L155 38M135 45L135 30" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 15 */ {
    label: "Code Kata",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Figure doing sword kata */}
        <Head cx={135} cy={110} r={22} />
        <path d="M135 132L135 215" stroke={S} strokeWidth={SW} />
        <path d="M135 165L95 135" stroke={S} strokeWidth={SW} />
        <path d="M135 165L175 185" stroke={S} strokeWidth={SW} />
        <path d="M135 215L105 265M135 215L165 265" stroke={S} strokeWidth={SW} />
        {/* Sword from hand */}
        <path d="M95 135L50 60" stroke={S} strokeWidth={SWh} />
        <path d="M48 57L52 62" stroke={S} strokeWidth="1.2" />
        {/* Sword trail arc */}
        <path d="M50 60Q15 130 40 230Q70 320 160 340Q240 330 250 240" stroke={S} strokeWidth="1.2" fill="none" strokeDasharray="8 5" opacity="0.4" />
        {/* Code along arc */}
        <text x="15" y="150" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">for</text>
        <text x="30" y="260" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">if</text>
        <text x="100" y="345" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">map</text>
        <text x="200" y="330" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">fn</text>
        <text x="240" y="260" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">( )</text>
        {/* Ground */}
        <path d="M70" y="275" stroke={S} strokeWidth="1.2" />
        <path d="M70 275L200 275" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 16 */ {
    label: "Deadline Dash",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Sprinting figure */}
        <Head cx={90} cy={145} r={22} />
        <path d="M90 167L98 240" stroke={S} strokeWidth={SW} />
        <path d="M95 200L130 178" stroke={S} strokeWidth={SW} />
        <path d="M95 200L65 175" stroke={S} strokeWidth={SW} />
        <path d="M98 240L70 265" stroke={S} strokeWidth={SW} />
        <path d="M98 240L138 255" stroke={S} strokeWidth={SW} />
        {/* Massive speed lines */}
        <SpeedLines x={55} y={148} dir="left" count={7} />
        <SpeedLines x={48} y={210} dir="left" count={6} />
        {/* Dust cloud */}
        <path d="M15 260Q28 248 42 260Q55 248 68 260Q78 248 85 260" stroke={S} strokeWidth="1.5" fill="none" />
        <path d="M10 280Q25 268 40 280Q52 268 65 280" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Giant clock looming */}
        <circle cx="200" cy="135" r="50" stroke={S} strokeWidth={SW} fill="none" />
        <path d="M200 95L200 135L228 148" stroke={S} strokeWidth={SWt} />
        <path d="M200 88L200 92M250 135L246 135M200 182L200 178M150 135L154 135" stroke={S} strokeWidth="1.5" />
        <path d="M170 92L160 78M230 92L240 78" stroke={S} strokeWidth="1.8" />
        {/* Ground */}
        <path d="M10 310L260 310" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 17 */ {
    label: "Tech Dojo",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Master + student */}
        <Head cx={65} cy={130} r={24} />
        <path d="M65 154L65 240" stroke={S} strokeWidth={SWh} />
        <path d="M65 190L38 215M65 190L105 178" stroke={S} strokeWidth={SW} />
        <path d="M65 240L45 300M65 240L85 300" stroke={S} strokeWidth={SW} />
        {/* Wisdom aura */}
        <circle cx="65" cy="195" r="55" stroke={S} strokeWidth="0.7" fill="none" strokeDasharray="3 5" />
        {/* Student */}
        <Head cx={205} cy={150} r={20} />
        <path d="M205 170L207 245" stroke={S} strokeWidth={SW} />
        <path d="M206 205L232 188M206 205L182 215" stroke={S} strokeWidth={SW} />
        <path d="M207 245L190 300M207 245L225 300" stroke={S} strokeWidth={SW} />
        <SpeedLines x={235} y={185} dir="right" count={4} />
        {/* Knowledge beam */}
        <path d="M105 178L182 205" stroke={S} strokeWidth="1.8" strokeDasharray="10 5" />
        <Impact cx={182} cy={205} r={10} />
        {/* Dojo floor */}
        <path d="M10 340L260 340" stroke={S} strokeWidth="1.5" />
        <path d="M10 340L10 335M70 340L70 335M130 340L130 335M190 340L190 335M250 340L250 335" stroke={S} strokeWidth="1" />
      </svg>
    ),
  },

  /* 18 */ {
    label: "Backflip Deploy",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Mid-backflip figure */}
        <Head cx={135} cy={95} r={20} />
        <path d="M135 115L130 165" stroke={S} strokeWidth={SW} />
        <path d="M132 138L112 118M132 138L155 118" stroke={S} strokeWidth={SW} />
        <path d="M130 165L110 185M130 165L148 190" stroke={S} strokeWidth={SW} />
        {/* Backflip arc trail */}
        <path d="M70 300Q55 200 90 130Q125 70 170 80Q210 100 210 190Q200 280 160 310" stroke={S} strokeWidth="1" fill="none" strokeDasharray="5 5" opacity="0.35" />
        {/* Ghost positions */}
        <circle cx="70" cy="280" r="10" stroke={S} strokeWidth="0.7" fill="none" opacity="0.2" />
        <circle cx="60" cy="200" r="10" stroke={S} strokeWidth="0.7" fill="none" opacity="0.25" />
        <circle cx="205" cy="180" r="10" stroke={S} strokeWidth="0.7" fill="none" opacity="0.2" />
        {/* Terminal below */}
        <rect x="45" y="330" width="180" height="80" rx="5" stroke={S} strokeWidth={SWt} fill="none" />
        <text x="60" y="360" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">$ deploy --prod</text>
        <text x="60" y="380" fontSize="12" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">✓ success!</text>
        <path d="M60 395L200 395" stroke={S} strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>
    ),
  },

  /* 19 */ {
    label: "Review Dodge",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Matrix dodge figure */}
        <Head cx={135} cy={210} r={22} />
        <path d="M135 232L130 300" stroke={S} strokeWidth={SW} />
        <path d="M132 260L105 245M132 260L115 280" stroke={S} strokeWidth={SW} />
        <path d="M130 300L112 345M130 300L148 345" stroke={S} strokeWidth={SW} />
        {/* Flying review comments */}
        <rect x="15" y="90" width="75" height="30" rx="4" stroke={S} strokeWidth="1.5" fill="none" />
        <text x="25" y="110" fontSize="11" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">LGTM?</text>
        <SpeedLines x={95} y={100} dir="right" count={4} />
        <rect x="80" y="50" width="90" height="30" rx="4" stroke={S} strokeWidth="1.5" fill="none" />
        <text x="88" y="70" fontSize="11" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">needs fix</text>
        <SpeedLines x={175} y={60} dir="right" count={4} />
        <rect x="155" y="120" width="82" height="30" rx="4" stroke={S} strokeWidth="1.5" fill="none" />
        <text x="163" y="140" fontSize="11" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none">refactor</text>
        <SpeedLines x={242} y={130} dir="right" count={3} />
        {/* Whoosh lines */}
        <path d="M112 195Q122 188 118 200" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M158 200Q168 193 164 205" stroke={S} strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },

  /* 20 */ {
    label: "Merge Conflict",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Two figures tug-of-war */}
        <Head cx={40} cy={155} r={18} />
        <path d="M40 173L45 240" stroke={S} strokeWidth={SW} />
        <path d="M43 205L80 185" stroke={S} strokeWidth={SW} />
        <path d="M43 205L20 218" stroke={S} strokeWidth={SW} />
        <path d="M45 240L28 285M45 240L62 285" stroke={S} strokeWidth={SW} />
        <SpeedLines x={15} y={158} dir="left" count={4} />
        <Head cx={230} cy={155} r={18} />
        <path d="M230 173L225 240" stroke={S} strokeWidth={SW} />
        <path d="M227 205L190 185" stroke={S} strokeWidth={SW} />
        <path d="M227 205L250 218" stroke={S} strokeWidth={SW} />
        <path d="M225 240L208 285M225 240L242 285" stroke={S} strokeWidth={SW} />
        <SpeedLines x={255} y={158} dir="right" count={4} />
        {/* Rope */}
        <path d="M80 185L190 185" stroke={S} strokeWidth={SWh} />
        {/* Conflict spark */}
        <Impact cx={135} cy={180} r={20} />
        {/* Git markers */}
        <text x="75" y="115" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">{"<<<< HEAD"}</text>
        <text x="75" y="320" fontSize="13" fontFamily="monospace" stroke={S} strokeWidth="0.7" fill="none">{">>>>"}</text>
        {/* Strain marks */}
        <path d="M65 170L58 158M72 165L66 152" stroke={S} strokeWidth="1.2" />
        <path d="M205 170L212 158M198 165L204 152" stroke={S} strokeWidth="1.2" />
        {/* Ground */}
        <path d="M10 340L260 340" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* ═══════════════════════════════════════════════
     21–30: STIK-DOMINANT
     ═══════════════════════════════════════════════ */

  /* 21 */ {
    label: "First Day Welcome",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Welcoming figure — big */}
        <Head cx={85} cy={120} r={28} />
        <path d="M85 148L85 250" stroke={S} strokeWidth={SWh} />
        <path d="M85 195L45 165" stroke={S} strokeWidth={SW} />
        <path d="M85 195L135 170" stroke={S} strokeWidth={SW} />
        <path d="M85 250L60 320M85 250L110 320" stroke={S} strokeWidth={SW} />
        {/* New member — smaller, shy */}
        <Head cx={200} cy={145} r={20} />
        <path d="M200 165L202 248" stroke={S} strokeWidth={SW} />
        <path d="M201 200L178 212M201 200L222 195" stroke={S} strokeWidth={SW} />
        <path d="M202 248L188 310M202 248L218 310" stroke={S} strokeWidth={SW} />
        {/* Heart */}
        <path d="M140 60Q140 42 152 42Q164 42 164 60Q164 78 152 88Q140 78 140 60Z" stroke={S} strokeWidth={SWt} fill="none" />
        {/* Sparkles */}
        <path d="M30 80L36 70L42 80M30 80L36 90L42 80" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M235" y="85" />
        <path d="M230 85L236 75L242 85M230 85L236 95L242 85" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Door frame */}
        <path d="M245 75L245 365L265 365L265 75" stroke={S} strokeWidth="1.8" fill="none" />
        <circle cx="261" cy="225" r="3" fill={S} />
        {/* Ground */}
        <path d="M10 365L265 365" stroke={S} strokeWidth="1.5" />
      </svg>
    ),
  },

  /* 22 */ {
    label: "Late Night Bond",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Two figures sitting on rooftop looking at stars */}
        <Head cx={95} cy={220} r={24} />
        <path d="M95 244L95 300" stroke={S} strokeWidth={SW} />
        <path d="M95 270L72 290M95 270L125 260" stroke={S} strokeWidth={SW} />
        <path d="M95 300L75 315Q65 322 70 330" stroke={S} strokeWidth={SW} />
        <path d="M95 300L118 315Q128 322 122 330" stroke={S} strokeWidth={SW} />
        <Head cx={175} cy={218} r={24} />
        <path d="M175 242L173 300" stroke={S} strokeWidth={SW} />
        <path d="M174 268L148 260M174 268L200 285" stroke={S} strokeWidth={SW} />
        <path d="M173 300L155 315Q145 322 150 330" stroke={S} strokeWidth={SW} />
        <path d="M173 300L195 315Q205 322 200 330" stroke={S} strokeWidth={SW} />
        {/* Connected hands */}
        <circle cx="135" cy="260" r="5" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Rooftop ledge */}
        <path d="M15 340L255 340" stroke={S} strokeWidth={SW} />
        <path d="M15 340L15 380M255 340L255 380" stroke={S} strokeWidth="1.8" />
        {/* Stars */}
        <path d="M40 60L43 50L46 60L35 55L51 55Z" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M135 40L138 30L141 40L130 35L146 35Z" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M220 70L223 60L226 70L215 65L231 65Z" stroke={S} strokeWidth="1.2" fill="none" />
        <circle cx="70" cy="90" r="2.5" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="190" cy="50" r="2.5" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="100" cy="45" r="2" stroke={S} strokeWidth="0.8" fill="none" />
        {/* Moon */}
        <circle cx="235" cy="80" r="18" stroke={S} strokeWidth="1.8" fill="none" />
        <circle cx="228" cy="75" r="14" stroke={S} strokeWidth="0" fill="white" />
      </svg>
    ),
  },

  /* 23 */ {
    label: "Shoulder to Lean On",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Supporting figure */}
        <Head cx={110} cy={120} r={24} />
        <path d="M110 144L110 245" stroke={S} strokeWidth={SWh} />
        <path d="M110 190L82 210M110 190L148 180" stroke={S} strokeWidth={SW} />
        <path d="M110 245L88 320M110 245L132 320" stroke={S} strokeWidth={SW} />
        {/* Leaning figure */}
        <Head cx={175} cy={135} r={22} />
        <path d="M175 157L170 248" stroke={S} strokeWidth={SW} />
        <path d="M172 195L195 210M172 195L150 188" stroke={S} strokeWidth={SW} />
        <path d="M170 248L155 320M170 248L190 320" stroke={S} strokeWidth={SW} />
        {/* Comfort aura */}
        <ellipse cx="140" cy="190" rx="65" ry="80" stroke={S} strokeWidth="0.6" fill="none" strokeDasharray="4 7" />
        {/* Z's */}
        <text x="200" y="105" fontSize="18" fontFamily="serif" stroke={S} strokeWidth="1" fill="none">z</text>
        <text x="218" y="88" fontSize="14" fontFamily="serif" stroke={S} strokeWidth="0.8" fill="none">z</text>
        <text x="232" y="74" fontSize="11" fontFamily="serif" stroke={S} strokeWidth="0.6" fill="none">z</text>
        {/* Ground */}
        <path d="M25 340L245 340" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 24 */ {
    label: "Victory Dance",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Jumping figure */}
        <Head cx={135} cy={95} r={28} />
        <path d="M135 123L135 210" stroke={S} strokeWidth={SWh} />
        <path d="M135 160L95 125M135 160L175 125" stroke={S} strokeWidth={SW} />
        <path d="M135 210L105 250M135 210L165 250" stroke={S} strokeWidth={SW} />
        {/* Confetti */}
        <path d="M60 100L66 88" stroke={S} strokeWidth="1.8" />
        <path d="M72 75L78 65" stroke={S} strokeWidth="1.5" />
        <path d="M205 95L213 85" stroke={S} strokeWidth="1.8" />
        <path d="M218 110L225 98" stroke={S} strokeWidth="1.5" />
        {/* Stars */}
        <path d="M45 140L48 132L51 140L40 136L56 136Z" stroke={S} strokeWidth="1" fill="none" />
        <path d="M225 130L228 122L231 130L220 126L236 126Z" stroke={S} strokeWidth="1" fill="none" />
        <path d="M90 55L93 47L96 55L85 51L101 51Z" stroke={S} strokeWidth="1" fill="none" />
        <path d="M180 50L183 42L186 50L175 46L191 46Z" stroke={S} strokeWidth="1" fill="none" />
        {/* Trophy */}
        <path d="M115 330L135 310L155 330" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M135 310L135 295" stroke={S} strokeWidth={SWt} />
        <path d="M118 295Q118 270 135 270Q152 270 152 295" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M118 280Q100 285 102 295" stroke={S} strokeWidth="1.2" fill="none" />
        <path d="M152 280Q170 285 168 295" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Ground */}
        <path d="M25 365L245 365" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 25 */ {
    label: "Community Circle",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Five figures in a circle */}
        {/* Top */}
        <Head cx={135} cy={75} r={16} />
        <path d="M135 91L135 125" stroke={S} strokeWidth={SW} />
        <path d="M135 105L112 115M135 105L158 115" stroke={S} strokeWidth={SWt} />
        {/* Left */}
        <Head cx={40} cy={175} r={16} />
        <path d="M40 191L40 225" stroke={S} strokeWidth={SW} />
        <path d="M40 205L60 192M40 205L28 220" stroke={S} strokeWidth={SWt} />
        {/* Right */}
        <Head cx={230} cy={175} r={16} />
        <path d="M230 191L230 225" stroke={S} strokeWidth={SW} />
        <path d="M230 205L210 192M230 205L242 220" stroke={S} strokeWidth={SWt} />
        {/* Bottom-left */}
        <Head cx={70} cy={310} r={16} />
        <path d="M70 326L70 358" stroke={S} strokeWidth={SW} />
        <path d="M70 340L50 330M70 340L95 332" stroke={S} strokeWidth={SWt} />
        {/* Bottom-right */}
        <Head cx={200} cy={310} r={16} />
        <path d="M200 326L200 358" stroke={S} strokeWidth={SW} />
        <path d="M200 340L220 330M200 340L175 332" stroke={S} strokeWidth={SWt} />
        {/* Connection circle */}
        <circle cx="135" cy="220" r="75" stroke={S} strokeWidth="1" fill="none" strokeDasharray="7 5" />
        {/* Heart in center */}
        <path d="M130 215Q130 205 135 205Q140 205 140 215Q140 225 135 230Q130 225 130 215Z" stroke={S} strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },

  /* 26 */ {
    label: "Morning Stretch",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* STIK figure stretching toward sun */}
        <Head cx={135} cy={155} r={28} />
        <path d="M135 183L135 285" stroke={S} strokeWidth={SWh} />
        <path d="M135 220L92 175M135 220L178 175" stroke={S} strokeWidth={SW} />
        <path d="M135 285L110 360M135 285L160 360" stroke={S} strokeWidth={SW} />
        {/* Sun */}
        <circle cx="135" cy="50" r="20" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M135 25L135 30M155 35L152 39M160 50L156 50M155 65L152 61M115 35L118 39M110 50L114 50M115 65L118 61" stroke={S} strokeWidth="1.2" />
        {/* Windows */}
        <rect x="15" y="80" width="55" height="65" rx="3" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M15 112L70 112M42 80L42 145" stroke={S} strokeWidth="1.2" />
        <rect x="200" y="85" width="55" height="60" rx="3" stroke={S} strokeWidth={SWt} fill="none" />
        <path d="M200 115L255 115M227 85L227 145" stroke={S} strokeWidth="1.2" />
        {/* Yawn */}
        <path d="M165 152Q172 148 175 155" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Ground */}
        <path d="M25 375L245 375" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 27 */ {
    label: "Carry Each Other",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Lower figure lifting upper figure */}
        <Head cx={110} cy={220} r={24} />
        <path d="M110 244L110 320" stroke={S} strokeWidth={SWh} />
        <path d="M110 275L82 290M110 275L150 240" stroke={S} strokeWidth={SW} />
        <path d="M110 320L88 385M110 320L132 385" stroke={S} strokeWidth={SW} />
        {/* Upper figure reaching up */}
        <Head cx={175} cy={105} r={22} />
        <path d="M175 127L170 210" stroke={S} strokeWidth={SW} />
        <path d="M172 165L200 135M172 165L150 185" stroke={S} strokeWidth={SW} />
        <path d="M170 210L155 255M170 210L190 255" stroke={S} strokeWidth={SW} />
        {/* Star being reached for */}
        <path d="M215 40L219 55L234 55L222 65L226 80L215 70L204 80L208 65L196 55L211 55Z" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Effort lines */}
        <path d="M80 210L72 198M88 205L78 195" stroke={S} strokeWidth="1.2" />
        {/* Clouds */}
        <path d="M15 90Q28 78 42 90Q55 78 68 90" stroke={S} strokeWidth="1.2" fill="none" />
        {/* Ground */}
        <path d="M10 395L260 395" stroke={S} strokeWidth="1.5" />
      </svg>
    ),
  },

  /* 28 */ {
    label: "Group Huddle",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Three figures heads together */}
        <Head cx={80} cy={130} r={24} />
        <path d="M80 154L83 250" stroke={S} strokeWidth={SW} />
        <path d="M82 195L112 180M82 195L55 208" stroke={S} strokeWidth={SW} />
        <path d="M83 250L62 320M83 250L102 320" stroke={S} strokeWidth={SW} />
        <Head cx={135} cy={118} r={24} />
        <path d="M135 142L135 248" stroke={S} strokeWidth={SW} />
        <path d="M135 190L108 180M135 190L162 180" stroke={S} strokeWidth={SW} />
        <path d="M135 248L115 320M135 248L155 320" stroke={S} strokeWidth={SW} />
        <Head cx={190} cy={130} r={24} />
        <path d="M190 154L187 250" stroke={S} strokeWidth={SW} />
        <path d="M188 195L158 180M188 195L215 208" stroke={S} strokeWidth={SW} />
        <path d="M187 250L168 320M187 250L208 320" stroke={S} strokeWidth={SW} />
        {/* Connection zone */}
        <circle cx="135" cy="182" r="22" stroke={S} strokeWidth="1" fill="none" strokeDasharray="4 4" />
        {/* Shared thought bubble */}
        <circle cx="135" cy="45" r="18" stroke={S} strokeWidth="1.5" fill="none" />
        <circle cx="133" cy="41" r="2" fill={S} />
        <circle cx="137" cy="41" r="2" fill={S} />
        <circle cx="132" cy="70" r="4" stroke={S} strokeWidth="1" fill="none" />
        <circle cx="134" cy="80" r="2.5" stroke={S} strokeWidth="0.8" fill="none" />
        {/* Ground */}
        <path d="M15 355L255 355" stroke={S} strokeWidth="1.2" />
      </svg>
    ),
  },

  /* 29 */ {
    label: "Silent Focus",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Meditation figure */}
        <Head cx={135} cy={120} r={28} />
        {/* Closed eyes */}
        <path d="M124 118L132 118M138 118L146 118" stroke={S} strokeWidth="2" />
        <path d="M135 148L135 260" stroke={S} strokeWidth={SWh} />
        <path d="M135 210L100 240M135 210L170 240" stroke={S} strokeWidth={SW} />
        <path d="M135 260L100 275Q85 282 92 295" stroke={S} strokeWidth={SW} />
        <path d="M135 260L170 275Q185 282 178 295" stroke={S} strokeWidth={SW} />
        {/* Meditation circles */}
        <circle cx="135" cy="210" r="55" stroke={S} strokeWidth="0.7" fill="none" strokeDasharray="5 7" />
        <circle cx="135" cy="210" r="75" stroke={S} strokeWidth="0.5" fill="none" strokeDasharray="4 10" />
        <circle cx="135" cy="210" r="95" stroke={S} strokeWidth="0.3" fill="none" strokeDasharray="3 12" />
        {/* Closed laptop */}
        <path d="M100 345L170 345L174 338L96 338Z" stroke={S} strokeWidth="1.5" fill="none" />
        {/* Faint code thoughts */}
        <text x="30" y="120" fontSize="22" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none" opacity="0.2">{"{ }"}</text>
        <text x="205" y="115" fontSize="22" fontFamily="monospace" stroke={S} strokeWidth="0.6" fill="none" opacity="0.2">{"( )"}</text>
      </svg>
    ),
  },

  /* 30 */ {
    label: "We Are NG Cult",
    sketch: (
      <svg viewBox="0 0 270 480" fill="none">
        {/* Grand finale: 5 linked figures */}
        {/* Figure 1 */}
        <Head cx={30} cy={165} r={16} />
        <path d="M30 181L30 235" stroke={S} strokeWidth={SW} />
        <path d="M30 205L52 198" stroke={S} strokeWidth={SWt} />
        <path d="M30 235L20 278M30 235L42 278" stroke={S} strokeWidth={SWt} />
        {/* Figure 2 */}
        <Head cx={80} cy={155} r={18} />
        <path d="M80 173L80 230" stroke={S} strokeWidth={SW} />
        <path d="M80 198L52 198M80 198L108 192" stroke={S} strokeWidth={SWt} />
        <path d="M80 230L66 278M80 230L94 278" stroke={S} strokeWidth={SWt} />
        {/* Figure 3 — center, tallest */}
        <Head cx={135} cy={130} r={22} />
        <path d="M135 152L135 228" stroke={S} strokeWidth={SWh} />
        <path d="M135 190L108 192M135 190L162 192" stroke={S} strokeWidth={SWt} />
        <path d="M135 228L118 280M135 228L152 280" stroke={S} strokeWidth={SW} />
        {/* Figure 4 */}
        <Head cx={190} cy={155} r={18} />
        <path d="M190 173L190 230" stroke={S} strokeWidth={SW} />
        <path d="M190 198L162 192M190 198L218 198" stroke={S} strokeWidth={SWt} />
        <path d="M190 230L176 278M190 230L204 278" stroke={S} strokeWidth={SWt} />
        {/* Figure 5 */}
        <Head cx={240} cy={165} r={16} />
        <path d="M240 181L240 235" stroke={S} strokeWidth={SW} />
        <path d="M240 205L218 198" stroke={S} strokeWidth={SWt} />
        <path d="M240 235L228 278M240 235L252 278" stroke={S} strokeWidth={SWt} />
        {/* NG CULT flag */}
        <path d="M135 130L135 45" stroke={S} strokeWidth="1.8" />
        <rect x="138" y="40" width="58" height="24" rx="2" stroke={S} strokeWidth="1.5" fill="none" />
        <text x="144" y="57" fontSize="13" fontWeight="bold" fontFamily="sans-serif" stroke={S} strokeWidth="1" fill="none">CULT</text>
        {/* Sparkles above */}
        <path d="M55" y="55" />
        <path d="M55 55L58 47L61 55L50 51L66 51Z" stroke={S} strokeWidth="1" fill="none" />
        <path d="M210 48L213 40L216 48L205 44L221 44Z" stroke={S} strokeWidth="1" fill="none" />
        <path d="M105 38L108 30L111 38L100 34L116 34Z" stroke={S} strokeWidth="1" fill="none" />
        {/* Ground */}
        <path d="M5 295L265 295" stroke={S} strokeWidth="1.8" />
      </svg>
    ),
  },
];
