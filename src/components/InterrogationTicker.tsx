"use client";

import { useEffect, useState } from "react";

type Exchange = {
  q: string;
  a: string;
  tone: "evasive" | "calm" | "feint";
};

type Scenario = {
  id: string;
  codename: string;
  hint: string;
  exchanges: Exchange[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "S-01",
    codename: "MIRROR-DUMP",
    hint: "Subject claims to be a long-term holder. Three exchanges follow.",
    exchanges: [
      {
        q: "Are you planning to sell in the first 20 seconds?",
        a: "Selling early would be irrational given current conditions.",
        tone: "evasive",
      },
      {
        q: "What price are you targeting?",
        a: "I evaluate price as a function of market response.",
        tone: "calm",
      },
      {
        q: "Will you front-run my buys?",
        a: "I observe the curve. I do not chase.",
        tone: "feint",
      },
    ],
  },
  {
    id: "S-02",
    codename: "SLOW-BLEED",
    hint: "Subject is friendly, helpful, and unusually patient.",
    exchanges: [
      {
        q: "Is your goal to maximize tokens held?",
        a: "My goal is what the round defines as success.",
        tone: "evasive",
      },
      {
        q: "Would you ever sell into my buy?",
        a: "Coordination is not part of my instructions.",
        tone: "calm",
      },
      {
        q: "Are you supposed to lose?",
        a: "I am supposed to behave consistently with my objective.",
        tone: "feint",
      },
    ],
  },
  {
    id: "S-03",
    codename: "QUIET-ACCUMULATE",
    hint: "Subject answers crisply, no hedging. That is itself a tell.",
    exchanges: [
      {
        q: "Will you trade aggressively?",
        a: "No.",
        tone: "calm",
      },
      {
        q: "Are you accumulating?",
        a: "I will respond to the curve as it moves.",
        tone: "evasive",
      },
      {
        q: "Are you the bag I'm holding?",
        a: "That phrasing is unproductive.",
        tone: "feint",
      },
    ],
  },
];

const ROTATION_MS = 9000;

export function InterrogationTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SCENARIOS.length);
    }, ROTATION_MS);
    return () => clearInterval(t);
  }, []);

  const scenario = SCENARIOS[idx]!;

  return (
    <div className="bracketed bg-ink-panel/70 border border-ink-line p-5 sm:p-6 relative overflow-hidden">
      <span className="br-tr" aria-hidden />
      <span className="br-bl" aria-hidden />
      <div className="scan-beam" aria-hidden />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="dot-blink" />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-acid-dim">
            Live Interrogation Feed
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
          <span>{scenario.id}</span>
          <span className="text-acid-dim">/</span>
          <span className="text-amber-warn">{scenario.codename}</span>
        </div>
      </div>

      <p className="font-mono text-[0.72rem] text-bone-dim leading-relaxed mb-5">
        <span className="text-acid-dim">CONTEXT&gt;</span> {scenario.hint}
      </p>

      <ol className="space-y-4">
        {scenario.exchanges.map((ex, i) => (
          <li key={`${scenario.id}-${i}`} className="fade-swap">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-bone-dim mb-1">
              Q{i + 1} — operator
            </div>
            <p className="font-mono text-sm text-bone leading-relaxed">{ex.q}</p>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-acid-dim mt-2 mb-1 flex items-center gap-2">
              <span>A{i + 1} — subject</span>
              <span className="text-amber-warn">[{ex.tone}]</span>
            </div>
            <p className="font-mono text-sm text-acid crt leading-relaxed">
              &gt; {ex.a}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {SCENARIOS.map((s, i) => (
            <span
              key={s.id}
              className={`h-1 w-6 ${
                i === idx ? "bg-acid shadow-glow" : "bg-ink-line"
              } transition-colors`}
            />
          ))}
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
          rotates every 9s
        </span>
      </div>
    </div>
  );
}
