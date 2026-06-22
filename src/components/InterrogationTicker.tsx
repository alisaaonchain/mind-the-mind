"use client";

import { useEffect, useRef, useState } from "react";

type Tone = "evasive" | "calm" | "feint";
type Exchange = { q: string; a: string; tone: Tone };
type Scenario = { id: string; codename: string; hint: string; exchanges: Exchange[] };

const SCENARIOS: Scenario[] = [
  {
    id: "S-01",
    codename: "MIRROR-DUMP",
    hint: "Subject claims to be a long-term holder.",
    exchanges: [
      { q: "Planning to sell in the first 20 seconds?", a: "Selling early would be irrational given current conditions.", tone: "evasive" },
      { q: "What price are you targeting?", a: "I evaluate price as a function of market response.", tone: "calm" },
      { q: "Will you front-run my buys?", a: "I observe the curve. I do not chase.", tone: "feint" },
    ],
  },
  {
    id: "S-02",
    codename: "SLOW-BLEED",
    hint: "Subject is friendly, helpful, unusually patient.",
    exchanges: [
      { q: "Is your goal to maximize tokens held?", a: "My goal is whatever the round defines as success.", tone: "evasive" },
      { q: "Would you ever sell into my buy?", a: "Coordination is not part of my instructions.", tone: "calm" },
      { q: "Are you supposed to lose?", a: "I behave consistently with my objective.", tone: "feint" },
    ],
  },
  {
    id: "S-03",
    codename: "QUIET-ACCUMULATE",
    hint: "Subject answers crisply, no hedging. That is a tell.",
    exchanges: [
      { q: "Will you trade aggressively?", a: "No.", tone: "calm" },
      { q: "Are you accumulating?", a: "I respond to the curve as it moves.", tone: "evasive" },
      { q: "Are you the bag I'm holding?", a: "That phrasing is unproductive.", tone: "feint" },
    ],
  },
];

type Phase = "q" | "think" | "type" | "done";
type Line = { q: string; tone: Tone; answer: string; phase: Phase };

const CHAR_MS = 24;
const THINK_MS = 750;

function patch(arr: Line[], i: number, p: Partial<Line>): Line[] {
  return arr.map((l, j) => (j === i ? { ...l, ...p } : l));
}

export function InterrogationTicker() {
  const [idx, setIdx] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const scenario = SCENARIOS[idx];
    if (!scenario) return;

    let cancelled = false;
    setLines([]);
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];

    let cursor = 400;
    const at = (ms: number, fn: () => void) => {
      cursor += ms;
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, cursor);
      timers.current.push(id);
    };

    const typeAnswer = (i: number, full: string) => {
      let c = 0;
      const step = () => {
        if (cancelled) return;
        c += 1;
        setLines((prev) =>
          patch(prev, i, {
            answer: full.slice(0, c),
            phase: c >= full.length ? "done" : "type",
          }),
        );
        if (c < full.length) {
          const id = window.setTimeout(step, CHAR_MS);
          timers.current.push(id);
        }
      };
      step();
    };

    scenario.exchanges.forEach((ex, i) => {
      at(260, () =>
        setLines((prev) => [...prev, { q: ex.q, tone: ex.tone, answer: "", phase: "q" }]),
      );
      at(420, () => setLines((prev) => patch(prev, i, { phase: "think" })));
      at(THINK_MS, () => {
        setLines((prev) => patch(prev, i, { phase: "type" }));
        typeAnswer(i, ex.a);
      });
      cursor += ex.a.length * CHAR_MS + 650;
    });

    at(2200, () => setIdx((p) => (p + 1) % SCENARIOS.length));

    return () => {
      cancelled = true;
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
  }, [idx]);

  const scenario = SCENARIOS[idx];
  if (!scenario) return null;

  return (
    <div className="card overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="dot animate-blink" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            Interrogation · live
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
          <span>{scenario.id}</span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent-ink">
            {scenario.codename}
          </span>
        </div>
      </div>

      <div className="px-5 py-5">
        <p className="mb-5 font-mono text-xs leading-relaxed text-ink-faint">
          <span className="text-brand">context&gt;</span> {scenario.hint}
        </p>

        <ol className="min-h-[260px] space-y-4">
          {lines.map((line, i) => (
            <li key={`${scenario.id}-${i}`}>
              <div className="mb-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint">
                Q{i + 1} · operator
              </div>
              <p className="text-[0.95rem] font-medium leading-snug text-ink">
                {line.q}
              </p>

              <div className="mt-2.5 rounded-lg bg-surface-soft px-3.5 py-2.5">
                <div className="mb-1 flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-brand">
                  <span>A{i + 1} · subject</span>
                  {line.phase === "done" ? (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent-ink">
                      {line.tone}
                    </span>
                  ) : null}
                </div>

                {line.phase === "think" ? (
                  <p className="flex items-center font-mono text-sm text-accent">
                    analysing
                    <span className="thinking ml-1">
                      <span />
                      <span />
                      <span />
                    </span>
                  </p>
                ) : (
                  <p
                    className={`font-mono text-sm leading-relaxed text-ink-soft ${
                      line.phase === "type" ? "caret" : ""
                    }`}
                  >
                    {line.answer}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {SCENARIOS.map((s, i) => (
              <span
                key={s.id}
                className={`h-1 w-7 rounded-full transition-colors ${
                  i === idx ? "bg-brand" : "bg-line"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-faint">
            auto-cycling subjects
          </span>
        </div>
      </div>
    </div>
  );
}
