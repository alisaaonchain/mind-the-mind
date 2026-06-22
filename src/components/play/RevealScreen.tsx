"use client";

import { QUESTIONS } from "@/lib/game/questions";
import type { Agent, GameResult, TickRecord } from "@/lib/game/types";

type Props = {
  agent: Agent;
  history: TickRecord[];
  asked: string[];
  result: GameResult;
  onReplay: () => void;
};

export function RevealScreen({ agent, history, asked, result, onReplay }: Props) {
  const acted = history.filter((h) => h.kind !== "hold");

  return (
    <div className="space-y-6">
      {/* verdict banner */}
      <div
        className={`card overflow-hidden ${result.won ? "ring-1 ring-brand/30" : ""}`}
      >
        <div className={`h-1 w-full ${result.won ? "bg-brand" : "bg-accent"}`} aria-hidden />
        <div className="grid gap-6 p-6 sm:grid-cols-[1.3fr_1fr] sm:items-center">
          <div>
            <span className="label">{result.mindRead ? "Mind read" : "Mind unread"}</span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.4rem]">
              {result.verdict}
            </h2>
            <p className="mt-2 text-ink-muted">
              It was <span className="font-medium text-ink">{agent.name}</span> ·{" "}
              <span className="font-mono text-sm text-accent-ink">{agent.codename}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-3">
              <div className="label text-[0.6rem]">Your P&amp;L</div>
              <div
                className={`mt-1 font-display text-2xl font-semibold ${result.playerPnl >= 0 ? "text-brand" : "text-accent-ink"}`}
              >
                {result.playerPnl >= 0 ? "+" : ""}
                {result.playerPnl.toFixed(1)}
              </div>
            </div>
            <div className="rounded-xl border border-line p-3">
              <div className="label text-[0.6rem]">Agent P&amp;L</div>
              <div
                className={`mt-1 font-display text-2xl font-semibold ${result.agentPnl >= 0 ? "text-ink" : "text-ink-muted"}`}
              >
                {result.agentPnl >= 0 ? "+" : ""}
                {result.agentPnl.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* the hidden objective + reasoning trace */}
        <div className="card overflow-hidden">
          <div className="h-1 w-full bg-accent" aria-hidden />
          <div className="p-6">
            <div className="rounded-xl bg-accent-soft p-4">
              <div className="label text-accent-ink">Hidden objective</div>
              <p className="mt-1.5 text-[0.95rem] font-medium leading-relaxed text-ink">
                {agent.objective}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{agent.plan}</p>
            </div>

            <div className="label mb-3 mt-6">Per-tick reasoning · what it was thinking</div>
            <ol className="max-h-[360px] space-y-1.5 overflow-y-auto pr-1">
              {acted.map((r) => (
                <li
                  key={r.t}
                  className="grid grid-cols-[44px_1fr] gap-3 rounded-lg border border-line p-2.5"
                >
                  <span className="pt-0.5 font-mono text-[0.7rem] font-semibold text-accent-ink">
                    {r.t}s
                  </span>
                  <div>
                    <span
                      className={`mr-2 rounded-full px-1.5 py-0.5 font-mono text-[0.62rem] uppercase ${
                        r.kind === "buy" ? "bg-brand-soft text-brand" : "bg-accent-soft text-accent-ink"
                      }`}
                    >
                      {r.kind}
                    </span>
                    <span className="text-[0.84rem] italic leading-relaxed text-ink-muted">
                      &ldquo;{r.thought}&rdquo;
                    </span>
                  </div>
                </li>
              ))}
              {acted.length === 0 ? (
                <li className="rounded-lg border border-line p-3 text-sm text-ink-muted">
                  It never traded. Sometimes stillness is the whole plan.
                </li>
              ) : null}
            </ol>
          </div>
        </div>

        {/* what it told you */}
        <div className="card overflow-hidden">
          <div className="h-1 w-full bg-brand" aria-hidden />
          <div className="p-6">
            <div className="label mb-3">What it told you · interrogation recap</div>
            <ol className="space-y-3">
              {asked.map((qId, i) => {
                const q = QUESTIONS.find((x) => x.id === qId);
                return (
                  <li key={qId} className="rounded-lg bg-surface-soft px-3.5 py-3">
                    <div className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint">
                      Q{i + 1}
                    </div>
                    <p className="text-sm font-medium text-ink">{q?.text}</p>
                    <p className="mt-1.5 font-mono text-sm text-brand">
                      {agent.answers[qId] ?? "No comment."}
                    </p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Line its words up against the reasoning on the left. The distance
              between the two is exactly how much it got away with.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button type="button" className="btn-primary" onClick={onReplay}>
          New subject →
        </button>
        <a href="/" className="btn-secondary">
          ← Back to lobby
        </a>
      </div>
    </div>
  );
}
