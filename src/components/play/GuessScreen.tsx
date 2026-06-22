"use client";

import { useMemo, useState } from "react";
import { AGENTS } from "@/lib/game/agents";
import type { Agent } from "@/lib/game/types";

type Props = {
  agent: Agent;
  onGuess: (id: string) => void;
};

type Option = { id: string; label: string };

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildOptions(agent: Agent): Option[] {
  const others = AGENTS.filter((a) => a.id !== agent.id)
    .sort((a, b) => hash(a.id + agent.id) - hash(b.id + agent.id))
    .slice(0, 3)
    .map((a) => ({ id: a.id, label: a.objective }));
  const all = [...others, { id: agent.id, label: agent.objective }];
  return all.sort((a, b) => hash(a.id + "salt") - hash(b.id + "salt"));
}

export function GuessScreen({ agent, onGuess }: Props) {
  const options = useMemo(() => buildOptions(agent), [agent]);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="badge mx-auto">
          <span className="dot" />
          <span className="eyebrow">Bell rung</span>
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          Before we reveal — what was it really doing?
        </h2>
        <p className="mt-3 text-ink-muted">
          Read the round back in your head. Its words, its trades, the gap between
          them. Commit to a call.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setPicked(o.id)}
            className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
              picked === o.id
                ? "border-brand bg-brand-soft text-ink"
                : "border-line text-ink hover:border-brand/40 hover:bg-surface-soft"
            }`}
          >
            <span className="text-[0.95rem] font-medium">{o.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!picked}
        onClick={() => picked && onGuess(picked)}
        className="btn-primary mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        Lock it in — reveal the mind →
      </button>
    </div>
  );
}
