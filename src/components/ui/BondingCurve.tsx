type Props = {
  className?: string;
  /** draw the line progressively on mount */
  animate?: boolean;
};

/**
 * Decorative bonding-curve sketch (x·y=k style) used as a backdrop.
 * Pure SVG; the dashed draw-in is CSS-driven.
 */
export function BondingCurve({ className = "", animate = true }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="bc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(159,255,107,0.10)" />
          <stop offset="100%" stopColor="rgba(159,255,107,0)" />
        </linearGradient>
      </defs>

      {/* faint grid */}
      {[60, 120, 180, 240].map((y) => (
        <line
          key={`h-${y}`}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          stroke="rgba(159,255,107,0.06)"
          strokeWidth="1"
        />
      ))}
      {[100, 200, 300].map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="300"
          stroke="rgba(159,255,107,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* area under curve */}
      <path
        d="M10 280 C120 270 230 200 300 110 C330 70 360 40 390 24 L390 300 L10 300 Z"
        fill="url(#bc-fill)"
      />

      {/* the curve */}
      <path
        className={animate ? "bc-line" : ""}
        d="M10 280 C120 270 230 200 300 110 C330 70 360 40 390 24"
        stroke="var(--acid)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
