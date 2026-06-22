type Props = {
  className?: string;
  height?: number;
  /** "acid" | "amber" — colour of the trace */
  tone?: "acid" | "amber";
  /** seconds per loop; lower = faster */
  speed?: number;
  /** render a calmer, lower-amplitude idle line */
  calm?: boolean;
};

// One tile of an EEG-style trace, sampled every 6px across 120px.
// The value at x=120 equals the value at x=0 so two tiles loop seamlessly.
const TILE = [
  24, 24, 24, 22, 24, 10, 38, 18, 24, 24, 26, 24, 24, 14, 24, 6, 42, 24, 24, 20,
];
const CALM_TILE = [
  24, 24, 25, 23, 24, 21, 27, 24, 24, 23, 25, 24, 24, 22, 24, 20, 28, 24, 24, 23,
];

function buildPath(values: number[]): string {
  // two tiles back-to-back => width 240, seamless when scrolled -50%
  const pts: string[] = [];
  for (let tile = 0; tile < 2; tile++) {
    for (let i = 0; i < values.length; i++) {
      const x = tile * 120 + i * 6;
      const y = values[i] ?? 24;
      pts.push(`${x} ${y}`);
    }
  }
  pts.push(`240 ${values[0] ?? 24}`);
  return `M${pts.join(" L")}`;
}

export function Waveform({
  className = "",
  height = 44,
  tone = "acid",
  speed = 6,
  calm = false,
}: Props) {
  const stroke = tone === "amber" ? "var(--amber)" : "var(--acid)";
  const d = buildPath(calm ? CALM_TILE : TILE);

  return (
    <div
      className={`waveform ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        className="waveform-svg"
        viewBox="0 0 240 48"
        preserveAspectRatio="none"
        style={{ animationDuration: `${speed}s` }}
      >
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
