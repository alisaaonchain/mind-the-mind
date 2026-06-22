"use client";

import { useEffect, useRef, useState } from "react";
import { callAgent } from "@/lib/game/llm";
import { settleRound, type SettleResult } from "@/lib/game/settleClient";
import { payout, STAKE, READ_MULTIPLIER } from "@/lib/game/economy";
import type { Exchange } from "@/lib/game/useGame";
import type { Agent, GameResult, TickRecord } from "@/lib/game/types";

type Props = {
  agent: Agent;
  history: TickRecord[];
  transcript: Exchange[];
  result: GameResult;
  seedBlock: number;
  startValue: number;
  credits: number;
  onAward: (net: number) => void;
  onReplay: () => void;
};

export function RevealScreen({
  agent,
  history,
  transcript,
  result,
  seedBlock,
  startValue,
  credits,
  onAward,
  onReplay,
}: Props) {
  const acted = history.filter((h) => h.kind !== "hold");
  const [debrief, setDebrief] = useState<string | null>(null);
  const [settle, setSettle] = useState<SettleResult | "pending" | null>("pending");
  const requested = useRef(false);

  const pnlFraction = startValue > 0 ? result.playerPnl / startValue : 0;
  const multiplier = result.mindRead ? READ_MULTIPLIER : 1;
  const payoutValue = payout(STAKE, pnlFraction, result.mindRead);
  const net = payoutValue - STAKE;

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    let live = true;

    onAward(net);

    const actions =
      acted.map((h) => `${h.t}s ${h.kind}`).join(", ") || "held the entire round";
    callAgent({
      mode: "debrief",
      codename: agent.codename,
      objective: agent.objective,
      actions,
    }).then((text) => {
      if (live) setDebrief(text);
    });

    settleRound({
      agent: agent.codename,
      seedBlock,
      playerPnl: result.playerPnl,
      agentPnl: result.agentPnl,
      mindRead: result.mindRead,
      won: result.won,
    }).then((r) => {
      if (live) setSettle(r);
    });

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settled = settle && settle !== "pending" && settle.ok ? settle : null;

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
            {settled ? (
              <a
                href={settled.explorer ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand-soft px-3 py-1 font-mono text-[0.7rem] text-brand transition-colors hover:bg-brand/10"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {settled.explorer ? "settled on-chain · view tx ↗" : "settled on-chain"}
              </a>
            ) : null}
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

      {/* play-money payout */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="label">Payout · play money</div>
          <div className="font-mono text-sm text-ink-muted">
            balance <span className="font-semibold text-ink">{credits.toFixed(0)}</span> credits
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm">
          <span className="text-ink-muted">buy-in {STAKE}</span>
          <span className="text-ink-faint">×</span>
          <span className="text-ink-muted">
            (1 {pnlFraction >= 0 ? "+" : "−"} {Math.abs(pnlFraction * 100).toFixed(1)}%)
          </span>
          <span className="text-ink-faint">×</span>
          <span className="text-ink-muted">read {multiplier.toFixed(1)}×</span>
          <span className="text-ink-faint">=</span>
          <span className="font-semibold text-ink">{payoutValue.toFixed(0)}</span>
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              net >= 0 ? "bg-brand-soft text-brand" : "bg-accent-soft text-accent-ink"
            }`}
          >
            {net >= 0 ? "+" : ""}
            {net.toFixed(0)} net
          </span>
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
              {debrief ? (
                <div className="mt-3 rounded-lg border border-accent/40 bg-surface px-3 py-2.5">
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Agent debrief · live model
                  </div>
                  <p className="text-[0.86rem] italic leading-relaxed text-ink">
                    &ldquo;{debrief}&rdquo;
                  </p>
                </div>
              ) : null}
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
              {transcript.map((ex, i) => (
                <li key={i} className="rounded-lg bg-surface-soft px-3.5 py-3">
                  <div className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint">
                    Q{i + 1}
                  </div>
                  <p className="text-sm font-medium text-ink">{ex.q}</p>
                  <p className="mt-1.5 font-mono text-sm text-brand">{ex.a}</p>
                </li>
              ))}
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
