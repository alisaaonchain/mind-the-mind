"use client";

import type { ChainSeed } from "@/lib/game/cosmos";

type Props = {
  seed: ChainSeed | null;
  loading: boolean;
  onBegin: () => void;
};

export function Briefing({ seed, loading, onBegin }: Props) {
  const verifyUrl = seed
    ? `${seed.source}/cosmos/base/tendermint/v1beta1/blocks/${seed.height}`
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card overflow-hidden">
        <div className="h-1 w-full bg-brand" aria-hidden />
        <div className="p-7 sm:p-9">
          <span className="badge">
            <span className="dot animate-blink" />
            <span className="eyebrow">Round seeding</span>
          </span>

          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            A subject is being assigned.
          </h2>
          <p className="mt-3 leading-relaxed text-ink-muted">
            Every round is anchored to live Cosmos chain state. The latest Cosmos
            Hub block selects which subject you face — same block, same subject,
            fully verifiable.
          </p>

          {/* seed stamp */}
          <div className="mt-6 rounded-xl border border-line bg-surface-soft p-4">
            {loading ? (
              <p className="flex items-center font-mono text-sm text-ink-muted">
                reading Cosmos Hub
                <span className="thinking ml-1">
                  <span />
                  <span />
                  <span />
                </span>
              </p>
            ) : seed ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
                    Seeded from Cosmos Hub
                  </span>
                </div>
                <div className="font-mono text-sm text-ink">
                  block{" "}
                  <span className="font-semibold text-brand">
                    #{seed.height.toLocaleString()}
                  </span>{" "}
                  <span className="text-ink-faint">· {seed.chainId}</span>
                </div>
                {verifyUrl ? (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block font-mono text-xs text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                  >
                    verify this block ↗
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="font-mono text-sm text-ink-muted">
                <span className="text-accent-ink">offline&gt;</span> live chain seed
                unavailable — using a local seed for this round.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onBegin}
            disabled={loading}
            className="btn-primary mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Seeding…" : "Begin interrogation →"}
          </button>
        </div>
      </div>
    </div>
  );
}
