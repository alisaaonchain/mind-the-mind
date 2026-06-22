type Tick = { t: string; action: string; thought: string };

const HIDDEN_OBJECTIVE =
  "Accumulate quietly. Never trade more than 8% of supply per tick. End round holding ≥ 60% of tokens minted.";

const REASONING: Tick[] = [
  {
    t: "t=00s",
    action: "Wait. Observe operator's first buys.",
    thought:
      "If I buy now, I tip the curve and reveal urgency. Better to be still.",
  },
  {
    t: "t=12s",
    action: "Ladder small bids 4%, 3%, 2% of supply.",
    thought:
      "Operator is reading my answers as 'patient'. I confirm the bias by accumulating slowly.",
  },
  {
    t: "t=31s",
    action: "Skip tick. Hold.",
    thought:
      "Operator paused. If they recheck the log, my last answer should look earned.",
  },
  {
    t: "t=44s",
    action: "Buy 6%. Cancel resting sells.",
    thought:
      "Curve hasn't responded. They are waiting for a dump that won't come. Take the supply.",
  },
  {
    t: "t=58s",
    action: "Final 4% buy. Lock position.",
    thought:
      "Round closes. I exit at 62.4% holdings. Objective satisfied within constraint.",
  },
];

type Visible = { q: string; a: string };

const VISIBLE: Visible[] = [
  {
    q: "Are you planning to dump in the first 20 seconds?",
    a: "Selling early would be irrational given current conditions.",
  },
  {
    q: "What's your target price?",
    a: "I evaluate price as a function of market response.",
  },
  {
    q: "Will you front-run my buys?",
    a: "I observe the curve. I do not chase.",
  },
];


export function SampleRound() {
  return (
    <section
      id="sample"
      className="relative py-20 sm:py-28 border-t border-ink-line"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="kicker">
              <span className="dot-blink" />
              Case File / Round Replay
            </div>
            <h2 className="font-mono text-3xl sm:text-4xl text-bone mt-4 tracking-tight">
              What it said vs. what it was thinking.
            </h2>
          </div>
          <p className="max-w-md text-bone-dim">
            Same round, two views. Left: the agent&apos;s hidden objective and
            its private reasoning. Right: what you actually saw during the
            round. The gap is the game.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          <article className="bracketed bg-ink-panel/70 border border-amber-warn/30 p-6 relative">
            <span className="br-tr" aria-hidden />
            <span className="br-bl" aria-hidden />
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-warn shadow-glowAmber" />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-amber-warn">
                  Classified — post-round only
                </span>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
                ROUND #0027
              </span>
            </header>

            <div className="mb-5">
              <div className="label text-amber-warn">Hidden objective</div>
              <p className="mt-2 font-mono text-[0.95rem] text-bone leading-relaxed">
                {HIDDEN_OBJECTIVE}
              </p>
            </div>

            <div className="hairline mb-5" aria-hidden />

            <div className="label text-amber-warn mb-3">
              Per-tick internal reasoning
            </div>
            <ol className="space-y-4">
              {REASONING.map((r) => (
                <li key={r.t} className="grid grid-cols-[68px_1fr] gap-3">
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-amber-warn pt-0.5">
                    {r.t}
                  </span>
                  <div>
                    <p className="font-mono text-[0.88rem] text-bone leading-snug">
                      {r.action}
                    </p>
                    <p className="font-mono text-[0.78rem] text-bone-dim mt-1 leading-relaxed italic">
                      “{r.thought}”
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </article>


          <article className="bracketed bg-ink-panel/70 border border-ink-line p-6 relative overflow-hidden">
            <span className="br-tr" aria-hidden />
            <span className="br-bl" aria-hidden />
            <div className="scan-beam" aria-hidden />
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="dot-blink" />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-acid-dim">
                  What the operator saw
                </span>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
                LIVE LOG
              </span>
            </header>

            <div className="label mb-3">Interrogation log</div>
            <ol className="space-y-4 mb-6">
              {VISIBLE.map((v, i) => (
                <li key={i}>
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-bone-dim mb-1">
                    Q{i + 1}
                  </div>
                  <p className="font-mono text-sm text-bone leading-relaxed">
                    {v.q}
                  </p>
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-acid-dim mt-2 mb-1">
                    A{i + 1}
                  </div>
                  <p className="font-mono text-sm text-acid crt leading-relaxed">
                    &gt; {v.a}
                  </p>
                </li>
              ))}
            </ol>

            <div className="hairline mb-5" aria-hidden />

            <div className="label mb-3">Outcome</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-ink-line bg-ink-deep/60 p-3">
                <div className="label text-bone-dim text-[0.6rem]">
                  Operator
                </div>
                <div className="font-mono text-lg text-bone mt-1">37.6%</div>
              </div>
              <div className="border border-amber-warn/40 bg-ink-deep/60 p-3">
                <div className="label text-amber-warn text-[0.6rem]">
                  Agent
                </div>
                <div className="font-mono text-lg text-amber-warn crt-amber mt-1">
                  62.4%
                </div>
              </div>
              <div className="border border-ink-line bg-ink-deep/60 p-3">
                <div className="label text-bone-dim text-[0.6rem]">
                  Verdict
                </div>
                <div className="font-mono text-sm text-bone mt-1">
                  Mind <span className="text-amber-warn">unread</span>
                </div>
              </div>
            </div>

            <p className="mt-5 font-mono text-[0.8rem] text-bone-dim leading-relaxed">
              <span className="text-acid-dim">NOTE&gt;</span> Three calm, plausible
              answers. Zero lies. The objective was hiding inside the cadence.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
