// The Big Water three-line motif, redrawn as clean vector shapes
// (measured from the original artwork) so it scales crisply and each
// line can be animated or colored on its own.

type Props = {
  className?: string;
  /** Show only the three horizontal lines (used as a divider/accent). */
  linesOnly?: boolean;
  /** Color of the three horizontal lines. Defaults to currentColor. */
  lineColor?: string;
  /** Color of the vertical bars. Defaults to currentColor. */
  barColor?: string;
  title?: string;
};

const H = [4, 31, 58]; // y of each horizontal line
const V = [
  { x: 88, w: 23, r: "bottom" },
  { x: 119, w: 22, r: "bottom" },
  { x: 147, w: 22, r: "bottom" },
  { x: 176, w: 22, r: "top" },
  { x: 205, w: 22, r: "top" },
  { x: 233, w: 22, r: "top" },
] as const;

// Rect with only the right end rounded.
const hbar = (y: number, x0 = 4, x1 = 84, h = 22) => {
  const r = h / 2;
  return `M${x0} ${y}H${x1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y + h}H${x0}Z`;
};

// Vertical bar with either its top or bottom end rounded.
const vbar = (x: number, w: number, end: "top" | "bottom", y0 = 4, y1 = 80) => {
  const r = w / 2;
  return end === "top"
    ? `M${x} ${y1}V${y0 + r}A${r} ${r} 0 0 1 ${x + w} ${y0 + r}V${y1}Z`
    : `M${x} ${y0}H${x + w}V${y1 - r}A${r} ${r} 0 0 1 ${x} ${y1 - r}Z`;
};

export default function Motif({ className, linesOnly, lineColor, barColor, title }: Props) {
  return (
    <svg
      viewBox={linesOnly ? "0 0 88 84" : "0 0 258 84"}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g fill={lineColor ?? "currentColor"}>
        {H.map((y, i) => (
          <path key={y} d={hbar(y)} className="motif-line" style={{ ["--i" as string]: i }} />
        ))}
      </g>
      {!linesOnly && (
        <g fill={barColor ?? "currentColor"}>
          {V.map((b, i) => (
            <path key={b.x} d={vbar(b.x, b.w, b.r)} className="motif-bar" style={{ ["--i" as string]: i }} />
          ))}
        </g>
      )}
    </svg>
  );
}
