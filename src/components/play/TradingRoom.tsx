"use client";

import { PriceChart } from "@/components/play/PriceChart";
import { ROUND_SECONDS } from "@/lib/game/agents";
import type { Agent, TickRecord, Wallet } from "@/lib/game/types";

type Props = {
  agent: Agent;
  secondsLeft: number;
  history: TickRecord[];
  price: number;
  player: Wallet;
  playerValue: number;
  agentValue: number;
  startValue: number;
  onTrade: (kind: "buy" | "sell", frac: number) => void;
};

function pnlClass(v: number): string {
  return v > 0 ? "text-brand" : v < 0 ? "text-accent-ink" : "text-ink-muted";
}

const LAST_LABEL: Record<string, string> = {
  buy: "bought",
  sell: "sold",
  hold: "held",
};

export function TradingRoom({
  agent,
  secondsLeft,
  history,
  price,
  player,
  playerValue,
  agentValue,
  startValue,
  onTrade,
}: Props) {
  const elapsed = ROUND_SECONDS - secondsLeft;
  const pct = (elapsed / ROUND_SECONDS) * 100;
  const last = history.length ? history[history.length - 1]! : null;
  const playerPnl = playerValue - startValue;
  const recent = history.slice(-6).reverse();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* chart + timer */}
      <div className="card overflow-hidden">
        <div className="h-1 w-full bg-brand" aria-hidden />
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold tracking-tight text-ink">
                {price.toFixed(3)}
              </span>
              <span className="label">price · cash/token</span>
            </div>
            <div className="text-right">
              <div
                className={`font-display text-3xl font-semibold tabular-nums ${
                  secondsLeft <= 10 ? "text-accent" : "text-ink"
                }`}
              >
                {secondsLeft}s
              </div>
              <div className="label">to the bell</div>
            </div>
          </div>

          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="rounded-xl border border-line bg-surface-soft p-2">
            <PriceChart history={history} price={price} total={ROUND_SECONDS} height={210} />
          </div>

          {/* visible agent activity (no reasoning yet) */}
          <div className="mt-4">
            <div className="label mb-2">Agent activity · {agent.name}</div>
            <div className="flex flex-wrap gap-2">
              {recent.length === 0 ? (
                <span className="text-sm text-ink-faint">No moves yet…</span>
              ) : (
                recent.map((r) => (
                  <span
                    key={r.t}
                    className={`rounded-full px-2.5 py-1 font-mono text-[0.7rem] ${
                      r.kind === "buy"
                        ? "bg-brand-soft text-brand"
                        : r.kind === "sell"
                          ? "bg-accent-soft text-accent-ink"
                          : "bg-surface-sunken text-ink-faint"
                    }`}
                  >
                    {r.t}s {LAST_LABEL[r.kind]}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* wallets + controls */}
      <div className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="label">Your portfolio</span>
            <span className={`font-mono text-sm font-semibold ${pnlClass(playerPnl)}`}>
              {playerPnl >= 0 ? "+" : ""}
              {playerPnl.toFixed(1)}
            </span>
          </div>
          <div className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            {playerValue.toFixed(1)}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-surface-soft px-3 py-2">
              <div className="label text-[0.6rem]">Cash</div>
              <div className="mt-0.5 font-mono text-ink">{player.cash.toFixed(1)}</div>
            </div>
            <div className="rounded-lg bg-surface-soft px-3 py-2">
              <div className="label text-[0.6rem]">Tokens</div>
              <div className="mt-0.5 font-mono text-ink">{player.tokens.toFixed(1)}</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="label">Agent portfolio</span>
            {last ? (
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[0.66rem] ${
                  last.kind === "buy"
                    ? "bg-brand-soft text-brand"
                    : last.kind === "sell"
                      ? "bg-accent-soft text-accent-ink"
                      : "bg-surface-sunken text-ink-faint"
                }`}
              >
                {LAST_LABEL[last.kind]}
              </span>
            ) : null}
          </div>
          <div className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-soft">
            {agentValue.toFixed(1)}
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            You can see what it does — not why. The reasoning comes at the bell.
          </p>
        </div>

        <div className="card p-5">
          <div className="label mb-3">Your move</div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-primary justify-center" onClick={() => onTrade("buy", 0.25)}>
              Buy 25%
            </button>
            <button type="button" className="btn-primary justify-center" onClick={() => onTrade("buy", 0.5)}>
              Buy 50%
            </button>
            <button type="button" className="btn-secondary justify-center" onClick={() => onTrade("sell", 0.25)}>
              Sell 25%
            </button>
            <button type="button" className="btn-secondary justify-center" onClick={() => onTrade("sell", 0.5)}>
              Sell 50%
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            Buy spends a share of cash; sell unloads a share of tokens. Every move
            shifts the curve for both of you.
          </p>
        </div>
      </div>
    </div>
  );
}
