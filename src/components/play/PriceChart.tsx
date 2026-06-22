import type { TickRecord } from "@/lib/game/types";

type Props = {
  history: TickRecord[];
  price: number;
  total?: number;
  height?: number;
};

const W = 480;
const L = 16;
const R = 464;

export function PriceChart({ history, price, total = 60, height = 200 }: Props) {
  const H = height;
  const TOP = 14;
  const BOT = H - 22;

  const prices = history.map((h) => h.price).concat(price, 1);
  const min = Math.min(...prices) * 0.98;
  const max = Math.max(...prices) * 1.02;
  const span = max - min || 1;

  const xAt = (t: number) => L + (t / total) * (R - L);
  const yAt = (v: number) => BOT - ((v - min) / span) * (BOT - TOP);

  const pts = history.map((h) => `${xAt(h.t).toFixed(1)} ${yAt(h.price).toFixed(1)}`);
  const linePath = pts.length ? `M${pts.join(" L")}` : "";
  const areaPath =
    pts.length > 1
      ? `M${xAt(history[0]!.t).toFixed(1)} ${BOT} L${pts.join(" L")} L${xAt(
          history[history.length - 1]!.t,
        ).toFixed(1)} ${BOT} Z`
      : "";

  const lastT = history.length ? history[history.length - 1]!.t : 0;
  const cx = xAt(lastT);
  const cy = yAt(price);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id="pc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(79,70,229,0.16)" />
          <stop offset="100%" stopColor="rgba(79,70,229,0)" />
        </linearGradient>
      </defs>

      {[TOP, (TOP + BOT) / 2, BOT].map((y) => (
        <line key={y} x1={L} y1={y} x2={R} y2={y} stroke="rgba(11,13,18,0.06)" strokeWidth="1" />
      ))}

      {/* agent action markers */}
      {history.map((h, i) =>
        h.kind === "hold" ? null : (
          <line
            key={i}
            x1={xAt(h.t)}
            y1={TOP}
            x2={xAt(h.t)}
            y2={BOT}
            stroke={
              h.kind === "buy" ? "rgba(79,70,229,0.16)" : "rgba(255,106,61,0.22)"
            }
            strokeWidth="2"
          />
        ),
      )}

      {areaPath ? <path d={areaPath} fill="url(#pc-fill)" /> : null}
      {linePath ? (
        <path
          d={linePath}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {history.length ? (
        <>
          <circle cx={cx} cy={cy} r="7" fill="rgba(79,70,229,0.18)" />
          <circle cx={cx} cy={cy} r="4" fill="var(--brand)" />
        </>
      ) : null}
    </svg>
  );
}
