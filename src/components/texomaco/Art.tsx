import styles from "./TexomaCollective.module.css";

/* Brand illustration kit. Shapes echo the pin mark (sun, coral arc, layered water)
   without redrawing the logo itself. Colors come from the --tc-* tokens. */

const IVORY = "var(--tc-bg)";
const SAND = "var(--tc-sand)";
const SLATE = "var(--tc-primary)";
const DEEP = "var(--tc-deep)";
const TEAL = "var(--tc-accent)";
const SUN = "var(--tc-sun)";
const CORAL = "var(--tc-coral)";

/** Smooth repeating wave, starting one period off-canvas so it can drift seamlessly. */
function wave(y: number, amp: number, period: number, width: number, bottom: number) {
  let d = `M${-period} ${y}`;
  for (let x = -period; x < width + period; x += period) d += ` Q${x + period / 4} ${y - amp} ${x + period / 2} ${y} T${x + period} ${y}`;
  return `${d} L${width + period} ${bottom} L${-period} ${bottom}Z`;
}

type Tone = "sunset" | "day" | "dusk";
const SKY: Record<Tone, [string, string, string]> = {
  sunset: ["#f8eddc", "#f5c9a0", "#ec916c"],
  day: ["#fbf8ef", "#e3efe9", "#b9ddd3"],
  dusk: ["#3e6273", "#a8737a", "#e9956f"],
};

/** Portrait or wide lake scene: rising sun, coral arc, drifting water bands. */
export function Scene({ tone = "sunset", wide = false, className = "" }: { tone?: Tone; wide?: boolean; className?: string }) {
  const w = wide ? 1600 : 600;
  const h = wide ? 640 : 720;
  const horizon = wide ? 380 : 430;
  const cx = w / 2;
  const id = `sky-${tone}-${wide ? "w" : "p"}`;
  const [a, b, c] = SKY[tone];
  return (
    <svg className={`${styles.scene} ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset=".55" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
      {tone === "dusk" && [[0.12, 0.1], [0.3, 0.22], [0.78, 0.08], [0.9, 0.25], [0.6, 0.16], [0.42, 0.06]].map(([x, y], i) => <circle key={i} className={styles.twinkle} style={{ animationDelay: `${i * 0.6}s` }} cx={x * w} cy={y * h} r={wide ? 3 : 2.5} fill={IVORY} />)}
      <g className={styles.sunRise}>
        <circle cx={cx} cy={horizon} r={wide ? 230 : 190} fill="none" stroke={CORAL} strokeWidth={wide ? 58 : 48} />
        <circle cx={cx} cy={horizon + 6} r={wide ? 165 : 138} fill={SUN} />
      </g>
      <g className={styles.birds} fill="none" stroke={SLATE} strokeWidth="3" strokeLinecap="round">
        <path d={`M${w * 0.2} ${h * 0.2} q12 -12 24 0 q12 -12 24 0`} />
        <path d={`M${w * 0.27} ${h * 0.14} q8 -8 16 0 q8 -8 16 0`} />
      </g>
      <g className={styles.drift}>
        <path d={wave(horizon, 14, 150, w, h + 40)} fill={TEAL} stroke={IVORY} strokeWidth={wide ? 10 : 8} />
      </g>
      <g className={styles.driftSlow}>
        <path d={wave(horizon + (wide ? 90 : 105), 18, 150, w, h + 40)} fill={SLATE} stroke={IVORY} strokeWidth={wide ? 10 : 8} />
      </g>
      <g className={styles.drift}>
        <path d={wave(horizon + (wide ? 170 : 200), 16, 150, w, h + 40)} fill={DEEP} stroke={IVORY} strokeWidth={wide ? 10 : 8} />
      </g>
    </svg>
  );
}

/** Soft wave edge used between sections. */
export function WaveEdge({ color, flip = false, className = "" }: { color: string; flip?: boolean; className?: string }) {
  return (
    <svg className={`${styles.waveEdge} ${flip ? styles.flip : ""} ${className}`} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 52 C 180 8, 360 8, 540 44 S 900 92, 1080 52 S 1340 6, 1440 30 L1440 90 L0 90Z" fill={color} />
    </svg>
  );
}

/** Rotating stamp: TWO STATES • ONE LAKE around the pin. */
export function StampBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.stamp} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={styles.stampRing}>
        <defs><path id="tc-ring" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" /></defs>
        <text><textPath href="#tc-ring" startOffset="0">TWO STATES • ONE LAKE • TEXAS • OKLAHOMA • </textPath></text>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/texomaco/pin.png" alt="" width={70} height={94} />
    </div>
  );
}

/** Winding river line used in the Two States band. */
export function River({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className={styles.riverPath} d="M60 0 C 10 70, 110 120, 60 190 S 0 300, 64 370 S 118 480, 56 600" fill="none" stroke={TEAL} strokeWidth="22" strokeLinecap="round" />
      <path className={styles.riverPath} d="M60 0 C 10 70, 110 120, 60 190 S 0 300, 64 370 S 118 480, 56 600" fill="none" stroke={IVORY} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 18" />
    </svg>
  );
}

/** Small illustrated scenes for the This Is Texoma pillars. */
export function PillarArt({ index }: { index: number }) {
  const art = [
    // On the Water
    <g key="w"><circle cx="120" cy="96" r="54" fill="none" stroke={CORAL} strokeWidth="16" /><circle cx="120" cy="100" r="36" fill={SUN} /><path d={wave(104, 6, 60, 240, 180)} fill={TEAL} stroke={IVORY} strokeWidth="5" /><path d={wave(138, 7, 60, 240, 180)} fill={SLATE} stroke={IVORY} strokeWidth="5" /><path d="M150 100 L150 62 L174 98 Z" fill={IVORY} /><path d="M138 102 h44 l-6 10 h-32 z" fill={DEEP} /></g>,
    // Stay Texoma
    <g key="s"><circle cx="186" cy="44" r="18" fill={SUN} /><circle cx="194" cy="38" r="16" fill="var(--card)" />{[[40, 40], [70, 24], [150, 30], [104, 52]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.6" fill={IVORY} />)}<path d="M120 54 L186 150 L54 150 Z" fill={IVORY} /><path d="M120 92 L144 150 L96 150 Z" fill={SLATE} /><path d="M20 150 H220" stroke={DEEP} strokeWidth="8" strokeLinecap="round" /></g>,
    // Taste Texoma
    <g key="t"><circle cx="120" cy="100" r="54" fill={IVORY} /><circle cx="120" cy="100" r="38" fill={SAND} /><circle cx="120" cy="100" r="18" fill={CORAL} /><path d="M46 56 v26 M38 56 v20 q8 10 16 0 v-20 M46 82 v68" stroke={SLATE} strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M194 150 V56 q-16 18 -8 52 h8" stroke={SLATE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M108 42 q-8 -10 0 -20 M126 40 q-8 -10 0 -20" stroke={IVORY} strokeWidth="4" strokeLinecap="round" fill="none" /></g>,
    // People of Texoma
    <g key="p"><circle cx="76" cy="78" r="22" fill={CORAL} /><path d="M38 150 q38 -64 76 0" fill={CORAL} /><circle cx="164" cy="78" r="22" fill={TEAL} /><path d="M126 150 q38 -64 76 0" fill={TEAL} /><circle cx="120" cy="66" r="25" fill={SUN} stroke="var(--card)" strokeWidth="6" /><path d="M74 152 q46 -78 92 0" fill={SUN} stroke="var(--card)" strokeWidth="6" /></g>,
    // What's Happening
    <g key="h"><path d="M10 40 Q 120 110 230 40" stroke={IVORY} strokeWidth="3" fill="none" />{[30, 60, 90, 120, 150, 180, 210].map((x, i) => { const y = 40 + 70 * (1 - Math.pow((x - 120) / 110, 2)) * 0.62; return <g key={x}><line x1={x} y1={y} x2={x} y2={y + 8} stroke={IVORY} strokeWidth="3" /><circle className={styles.bulb} style={{ animationDelay: `${i * 0.25}s` }} cx={x} cy={y + 16} r="8" fill={i % 2 ? SUN : CORAL} /></g>; })}<rect x="78" y="118" width="84" height="44" rx="10" fill={IVORY} /><path d="M78 132 h84" stroke={CORAL} strokeWidth="8" /><circle cx="104" cy="148" r="4" fill={SLATE} /><circle cx="120" cy="148" r="4" fill={SLATE} /><circle cx="136" cy="148" r="4" fill={SLATE} /></g>,
    // Know Before You Go
    <g key="k"><circle cx="120" cy="92" r="60" fill={IVORY} /><circle cx="120" cy="92" r="46" fill="none" stroke={SAND} strokeWidth="6" />{[0, 90, 180, 270].map((r) => <line key={r} x1="120" y1="38" x2="120" y2="50" stroke={SLATE} strokeWidth="5" strokeLinecap="round" transform={`rotate(${r} 120 92)`} />)}<g className={styles.needle}><path d="M120 92 L132 92 L120 50 Z M120 92 L108 92 L120 50Z" fill={CORAL} /><path d="M120 92 L132 92 L120 134 Z M120 92 L108 92 L120 134Z" fill={SLATE} /></g><circle cx="120" cy="92" r="5" fill={SUN} /></g>,
    // Two States. One Lake.
    <g key="2"><rect x="20" y="30" width="96" height="124" rx="16" fill={CORAL} /><rect x="124" y="30" width="96" height="124" rx="16" fill={TEAL} /><path d="M120 18 C 92 54, 148 84, 116 116 S 132 152, 120 168" stroke={IVORY} strokeWidth="14" fill="none" strokeLinecap="round" /><text x="62" y="98" textAnchor="middle" fontSize="22" fontWeight="800" fill={IVORY} fontFamily="var(--font-body)">TX</text><text x="178" y="98" textAnchor="middle" fontSize="22" fontWeight="800" fill={SLATE} fontFamily="var(--font-body)">OK</text></g>,
    // Stay Another Day
    <g key="a"><circle cx="120" cy="96" r="44" fill={SUN} /><circle cx="140" cy="84" r="40" fill="var(--card)" />{[[40, 40], [60, 80], [196, 46], [180, 92], [96, 30]].map(([x, y]) => <circle key={x} className={styles.twinkle} cx={x} cy={y} r="2.6" fill={IVORY} />)}<path d={wave(128, 6, 60, 240, 180)} fill={DEEP} stroke={IVORY} strokeWidth="5" /></g>,
  ];
  return <svg className={styles.pillarArt} viewBox="0 0 240 180" aria-hidden="true" focusable="false">{art[index % art.length]}</svg>;
}

/** Line icons for the six value areas. */
export function ValueIcon({ index }: { index: number }) {
  const icons = [
    <g key="0"><circle cx="21" cy="21" r="12" /><path d="M30 30 l10 10" /></g>,
    <g key="1"><path d="M6 36 L18 24 L26 30 L42 12" /><path d="M32 12 h10 v10" /></g>,
    <g key="2"><rect x="8" y="10" width="32" height="30" rx="4" /><path d="M16 25 l6 6 l11 -12" /></g>,
    <g key="3"><path d="M24 4 l5 13 l14 1 l-11 9 l4 14 l-12 -8 l-12 8 l4 -14 l-11 -9 l14 -1z" /></g>,
    <g key="4"><circle cx="16" cy="24" r="10" /><circle cx="32" cy="24" r="10" /></g>,
    <g key="5"><path d="M17 32 a12 12 0 1 1 14 0 v6 h-14z" /><path d="M19 44 h10" /></g>,
  ];
  return <svg className={styles.valueIcon} viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{icons[index % icons.length]}</svg>;
}

/** Sun setting on the water: a small brand mark for cards. --card sets the ring color. */
export function SunMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 104" aria-hidden="true" focusable="false">
      <circle cx="80" cy="72" r="50" fill="none" stroke="var(--ring, var(--card))" strokeWidth="14" />
      <circle cx="80" cy="76" r="32" fill="var(--sunfill, var(--tc-sun))" />
      <path d="M0 78 Q20 68 40 78 T80 78 T120 78 T160 78 V104 H0Z" fill="var(--tc-accent)" stroke="var(--tc-bg)" strokeWidth="5" />
      <path d="M0 94 Q20 84 40 94 T80 94 T120 94 T160 94 V104 H0Z" fill="var(--tc-primary)" stroke="var(--tc-bg)" strokeWidth="5" />
    </svg>
  );
}
