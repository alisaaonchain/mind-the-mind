"use client";

import { useGame } from "@/lib/game/useGame";
import { InterrogationRoom } from "@/components/play/InterrogationRoom";
import { TradingRoom } from "@/components/play/TradingRoom";
import { GuessScreen } from "@/components/play/GuessScreen";
import { RevealScreen } from "@/components/play/RevealScreen";

const STEPS = ["Interrogate", "Trade", "Reveal"];

function stepIndex(phase: string): number {
  if (phase === "interrogation") return 0;
  if (phase === "trading") return 1;
  return 2;
}

export function Lab() {
  const g = useGame();
  const active = stepIndex(g.phase);

  return (
    <main className="relative overflow-hidden">
      <div className="aurora opacity-60" aria-hidden>
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
      </div>

      <section className="relative mx-auto max-w-6xl px-5 pb-28 pt-12 sm:px-8">
        {/* header + stepper */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge">
              <span className="dot animate-blink" />
              <span className="eyebrow">Lab · live round</span>
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
              {g.phase === "interrogation"
                ? "Interrogate the subject."
                : g.phase === "trading"
                  ? "Trade the curve. Read the room."
                  : g.phase === "guess"
                    ? "Make your call."
                    : "The reveal."}
            </h1>
          </div>

          <ol className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`flex h-7 items-center gap-2 rounded-full border px-3 font-mono text-[0.7rem] uppercase tracking-[0.1em] ${
                    i === active
                      ? "border-brand bg-brand-soft text-brand"
                      : i < active
                        ? "border-line bg-surface text-ink-faint"
                        : "border-line text-ink-faint"
                  }`}
                >
                  {i < active ? "✓" : i + 1} {s}
                </span>
                {i < STEPS.length - 1 ? (
                  <span className="h-px w-4 bg-line" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {g.phase === "interrogation" ? (
          <InterrogationRoom
            agent={g.agent}
            asked={g.asked}
            onAsk={g.askQuestion}
            onBegin={g.beginTrading}
          />
        ) : null}

        {g.phase === "trading" ? (
          <TradingRoom
            agent={g.agent}
            secondsLeft={g.secondsLeft}
            history={g.history}
            price={g.price}
            player={g.player}
            playerValue={g.playerValue}
            agentValue={g.agentValue}
            startValue={g.startValue}
            onTrade={g.trade}
          />
        ) : null}

        {g.phase === "guess" ? (
          <GuessScreen agent={g.agent} onGuess={g.submitGuess} />
        ) : null}

        {g.phase === "reveal" && g.result ? (
          <RevealScreen
            agent={g.agent}
            history={g.history}
            asked={g.asked}
            result={g.result}
            onReplay={g.reset}
          />
        ) : null}
      </section>
    </main>
  );
}
