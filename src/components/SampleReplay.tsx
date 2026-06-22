"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AGENT_HOLD,
  HIDDEN_OBJECTIVE,
  interp,
  PRICE,
  REASONING,
  VISIBLE,
} from "@/components/sample-round.data";

// chart geometry
const W = 320;
const H = 170;
const L = 14;
const R = 306;
const TOP = 14;
const BOT = 146;
const PMIN = 0.96;
const PMAX = 1.7;
const DURATION = 13; // real seconds to replay the 60s round

const xAt = (t: number) => L + (t / 60) * (R - L);
const yAt = (v: number) => BOT - ((v - PMIN) / (PMAX - PMIN)) * (BOT - TOP);

function pricePath(upto: number): string {
  const pts: string[] = [];
  for (const p of PRICE) {
    if (p.t <= upto) pts.push(`${xAt(p.t).toFixed(1)} ${yAt(p.v).toFixed(1)}`);
  }
  pts.push(`${xAt(upto).toFixed(1)} ${yAt(interp(PRICE, upto)).toFixed(1)}`);
  return `M${pts.join(" L")}`;
}

const fullPath = `M${PRICE.map((p) => `${xAt(p.t).toFixed(1)} ${yAt(p.v).toFixed(1)}`).join(" L")}`;

export function SampleReplay() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const started = useRef(false);

  const setTime = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(60, next));
    tRef.current = clamped;
    setT(clamped);
  }, []);

  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            setPlaying(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last: number | undefined;
    const speed = 60 / DURATION;
    const loop = (ts: number) => {
      if (last === undefined) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      const next = tRef.current + dt * speed;
      if (next >= 60) {
        setTime(60);
        setPlaying(false);
        return;
      }
      setTime(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, setTime]);

  const restart = () => {
    setTime(0);
    setPlaying(true);
  };
  const toggle = () => {
    if (t >= 60) {
      restart();
      return;
    }
    setPlaying((p) => !p);
  };

  const price = interp(PRICE, t);
  const agent = interp(AGENT_HOLD, t);
  const operator = 100 - agent;
  const finished = t >= 60;
  let activeIdx = -1;
  REASONING.forEach((r, i) => {
    if (r.t <= t + 0.001) activeIdx = i;
  });

  return (
    <div ref={hostRef} className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {/* LEFT — the agent's mind */}
      <article className="card overflow-hidden">
        <div className="h-1 w-full bg-accent" aria-hidden />
        <div className="p-6">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">
                Classified · the agent&apos;s mind
              </span>
            </div>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
              Round #0027
            </span>
          </header>

          <div className="rounded-xl bg-accent-soft p-4">
            <div className="label text-accent-ink">Hidden objective</div>
            <p className="mt-1.5 text-[0.95rem] font-medium leading-relaxed text-ink">
              {HIDDEN_OBJECTIVE}
            </p>
          </div>

          <div className="label mb-3 mt-6">Per-tick internal reasoning</div>
          <ol className="space-y-2">
            {REASONING.map((r, i) => {
              const state =
                i === activeIdx ? "tick-active" : i < activeIdx ? "" : "tick-idle";
              return (
                <li
                  key={r.t}
                  className={`tick-row grid grid-cols-[54px_1fr] gap-3 rounded-lg border border-transparent p-2.5 ${state}`}
                >
                  <span className="pt-0.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-accent-ink">
                    t={r.t}s
                  </span>
                  <div>
                    <p className="text-[0.9rem] font-medium leading-snug text-ink">
                      {r.action}
                    </p>
                    <p className="mt-1 text-[0.82rem] italic leading-relaxed text-ink-muted">
                      &ldquo;{r.thought}&rdquo;
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </article>

      {/* RIGHT — what the operator saw */}
      <article className="card overflow-hidden">
        <div className="h-1 w-full bg-brand" aria-hidden />
        <div className="p-6">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="dot animate-blink" />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
                What the operator saw
              </span>
            </div>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
              T+{t.toFixed(0).padStart(2, "0")}s / 60
            </span>
          </header>

          {/* price chart */}
          <div className="relative rounded-xl border border-line bg-surface-soft p-2">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
              {[TOP, (TOP + BOT) / 2, BOT].map((y) => (
                <line
                  key={y}
                  x1={L}
                  y1={y}
                  x2={R}
                  y2={y}
                  stroke="rgba(11,13,18,0.06)"
                  strokeWidth="1"
                />
              ))}
              <path d={fullPath} fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="1.5" />
              <path
                d={pricePath(t)}
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {REASONING.map((r) => (
                <line
                  key={r.t}
                  x1={xAt(r.t)}
                  y1={TOP}
                  x2={xAt(r.t)}
                  y2={BOT}
                  stroke={r.t <= t ? "rgba(255,106,61,0.55)" : "rgba(255,106,61,0.18)"}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              ))}
              <line
                x1={xAt(t)}
                y1={TOP}
                x2={xAt(t)}
                y2={BOT}
                stroke="var(--brand)"
                strokeWidth="1"
                opacity="0.4"
              />
              <circle cx={xAt(t)} cy={yAt(price)} r="4" fill="var(--brand)" />
              <circle cx={xAt(t)} cy={yAt(price)} r="7" fill="rgba(79,70,229,0.18)" />
            </svg>
            <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-white px-2 py-0.5 font-mono text-xs font-semibold text-brand shadow-sm">
              {price.toFixed(3)}
            </div>
          </div>

          {/* transport */}
          <div className="mt-3 flex items-center gap-3">
            <button type="button" className="ctrl" onClick={toggle}>
              {finished ? "↻ Replay" : playing ? "❚❚ Pause" : "▶ Play"}
            </button>
            <input
              type="range"
              className="scrub"
              min={0}
              max={60}
              step={0.1}
              value={t}
              onChange={(e) => {
                setPlaying(false);
                setTime(Number(e.target.value));
              }}
              aria-label="Scrub the round timeline"
            />
          </div>

          {/* live holdings */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-3">
              <div className="label text-[0.62rem]">You hold</div>
              <div className="mt-1 font-display text-xl font-semibold text-brand">
                {operator.toFixed(1)}%
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                <div className="h-full rounded-full bg-brand" style={{ width: `${operator}%` }} />
              </div>
            </div>
            <div
              className={`rounded-xl border p-3 ${finished ? "border-accent/50 bg-accent-soft" : "border-line"}`}
            >
              <div className="label text-[0.62rem] text-accent-ink">Agent holds</div>
              <div className="mt-1 font-display text-xl font-semibold text-accent-ink">
                {agent.toFixed(1)}%
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                <div className="h-full rounded-full bg-accent" style={{ width: `${agent}%` }} />
              </div>
            </div>
          </div>

          {/* interrogation log */}
          <div className="mt-4">
            <div className="label mb-2">Pre-round interrogation</div>
            <ol className="space-y-2">
              {VISIBLE.map((v, i) => (
                <li key={i} className="rounded-lg bg-surface-soft px-3 py-2 text-[0.82rem] leading-snug">
                  <span className="font-medium text-ink">Q{i + 1} {v.q}</span>
                  <br />
                  <span className="font-mono text-brand">{v.a}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* verdict */}
          <div
            className={`mt-4 rounded-xl border p-3.5 transition-colors ${finished ? "border-accent/50 bg-accent-soft" : "border-line"}`}
          >
            <div className="flex items-center justify-between">
              <span className="label text-[0.62rem]">Verdict</span>
              <span className="text-sm font-medium text-ink">
                {finished ? (
                  <>
                    Mind <span className="text-accent-ink">unread</span>
                  </>
                ) : (
                  <span className="text-ink-faint">round in progress…</span>
                )}
              </span>
            </div>
            {finished ? (
              <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-muted">
                Three calm, plausible answers. Zero lies. The objective was hiding
                inside the cadence.
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
