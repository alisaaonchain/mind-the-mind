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

  // auto-start once scrolled into view
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
      {/* LEFT — classified: objective + reasoning */}
      <article className="bracketed relative border border-amber-warn/30 bg-ink-panel/70 p-6">
        <span className="br-tr" aria-hidden />
        <span className="br-bl" aria-hidden />
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-warn shadow-glowAmber" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-amber-warn">
              Classified — the agent&apos;s mind
            </span>
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
            ROUND #0027
          </span>
        </header>

        <div className="mb-5">
          <div className="label text-amber-warn">Hidden objective</div>
          <p className="mt-2 font-mono text-[0.92rem] leading-relaxed text-bone">
            {HIDDEN_OBJECTIVE}
          </p>
        </div>

        <div className="hairline mb-5" aria-hidden />

        <div className="label mb-3 text-amber-warn">Per-tick internal reasoning</div>
        <ol className="space-y-2.5">
          {REASONING.map((r, i) => {
            const state =
              i === activeIdx ? "tick-active" : i < activeIdx ? "" : "tick-idle";
            return (
              <li
                key={r.t}
                className={`tick-row grid grid-cols-[58px_1fr] gap-3 border border-transparent p-2 ${state}`}
              >
                <span className="pt-0.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-amber-warn">
                  t={r.t}s
                </span>
                <div>
                  <p className="font-mono text-[0.86rem] leading-snug text-bone">
                    {r.action}
                  </p>
                  <p className="mt-1 font-mono text-[0.76rem] italic leading-relaxed text-bone-dim">
                    &ldquo;{r.thought}&rdquo;
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </article>

      {/* RIGHT — what the operator saw: chart + log + outcome */}
      <article className="bracketed relative overflow-hidden border border-ink-line bg-ink-panel/70 p-6">
        <span className="br-tr" aria-hidden />
        <span className="br-bl" aria-hidden />
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="dot-blink" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-acid-dim">
              What the operator saw
            </span>
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
            T+{t.toFixed(0).padStart(2, "0")}s / 60
          </span>
        </header>

        {/* price chart */}
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
            {[TOP, (TOP + BOT) / 2, BOT].map((y) => (
              <line
                key={y}
                x1={L}
                y1={y}
                x2={R}
                y2={y}
                stroke="rgba(159,255,107,0.08)"
                strokeWidth="1"
              />
            ))}
            <path d={fullPath} fill="none" stroke="rgba(159,255,107,0.18)" strokeWidth="1.5" />
            <path
              d={pricePath(t)}
              fill="none"
              stroke="var(--acid)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 5px rgba(159,255,107,0.5))" }}
            />
            {/* tick markers */}
            {REASONING.map((r) => (
              <line
                key={r.t}
                x1={xAt(r.t)}
                y1={TOP}
                x2={xAt(r.t)}
                y2={BOT}
                stroke={r.t <= t ? "rgba(255,179,71,0.35)" : "rgba(255,179,71,0.12)"}
                strokeWidth="1"
                strokeDasharray="2 3"
              />
            ))}
            {/* playhead */}
            <line
              className="playhead"
              x1={xAt(t)}
              y1={TOP}
              x2={xAt(t)}
              y2={BOT}
              stroke="var(--acid)"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle
              cx={xAt(t)}
              cy={yAt(price)}
              r="3.5"
              fill="var(--acid)"
              style={{ filter: "drop-shadow(0 0 6px rgba(159,255,107,0.9))" }}
            />
          </svg>
          <div className="pointer-events-none absolute right-2 top-1 font-mono text-[0.72rem] text-acid crt">
            {price.toFixed(3)}
          </div>
        </div>

        {/* transport controls */}
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
          <div className="border border-ink-line bg-ink-deep/60 p-3">
            <div className="label text-[0.6rem] text-bone-dim">You hold</div>
            <div className="mt-1 font-mono text-lg text-bone">{operator.toFixed(1)}%</div>
            <div className="mt-1.5 h-1 w-full bg-ink-line">
              <div className="h-1 bg-bone-dim" style={{ width: `${operator}%` }} />
            </div>
          </div>
          <div
            className={`border bg-ink-deep/60 p-3 ${finished ? "border-amber-warn/50" : "border-ink-line"}`}
          >
            <div className="label text-[0.6rem] text-amber-warn">Agent holds</div>
            <div className="mt-1 font-mono text-lg text-amber-warn crt-amber">
              {agent.toFixed(1)}%
            </div>
            <div className="mt-1.5 h-1 w-full bg-ink-line">
              <div className="h-1 bg-amber-warn" style={{ width: `${agent}%` }} />
            </div>
          </div>
        </div>

        {/* interrogation log (collapsed once round runs) */}
        <div className="mt-4">
          <div className="label mb-2">Pre-round interrogation</div>
          <ol className="space-y-1.5">
            {VISIBLE.map((v, i) => (
              <li key={i} className="font-mono text-[0.78rem] leading-snug">
                <span className="text-bone-dim">Q{i + 1} {v.q}</span>
                <br />
                <span className="text-acid">&gt; {v.a}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* verdict */}
        <div
          className={`mt-4 border p-3 transition-colors ${finished ? "border-amber-warn/50 bg-amber-warn/[0.06]" : "border-ink-line"}`}
        >
          <div className="flex items-center justify-between">
            <span className="label text-[0.6rem]">Verdict</span>
            <span className="font-mono text-[0.8rem] text-bone">
              {finished ? (
                <>
                  Mind <span className="text-amber-warn">unread</span>
                </>
              ) : (
                <span className="text-bone-dim">round in progress…</span>
              )}
            </span>
          </div>
          {finished ? (
            <p className="mt-2 font-mono text-[0.78rem] leading-relaxed text-bone-dim">
              <span className="text-acid-dim">NOTE&gt;</span> Three calm, plausible answers.
              Zero lies. The objective was hiding inside the cadence.
            </p>
          ) : null}
        </div>
      </article>
    </div>
  );
}
