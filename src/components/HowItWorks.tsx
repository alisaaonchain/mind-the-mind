type Step = {
  step: string;
  title: string;
  duration: string;
  body: string;
  bullets: string[];
};

const STEPS: Step[] = [
  {
    step: "01",
    title: "Interrogate",
    duration: "Ask 3 questions",
    body: "Before any trade happens, you get three questions. The agent must respond. It cannot refuse, but it can be evasive, deflect, or feint.",
    bullets: [
      "Free-form questions, no template",
      "Tone tags surface in the log",
      "Every word is part of the bait",
    ],
  },
  {
    step: "02",
    title: "Trade",
    duration: "60 seconds",
    body: "A bonding curve opens. You and the agent trade against each other and the curve, tick by tick. Every action moves price.",
    bullets: [
      "Real-time tick engine",
      "Shared liquidity, asymmetric goals",
      "What you saw in interrogation is the only edge you get",
    ],
  },
  {
    step: "03",
    title: "Reveal",
    duration: "Verdict",
    body: "After the round, its hidden objective is shown — alongside its per-tick reasoning. You see exactly what it was thinking versus what it told you.",
    bullets: [
      "Objective unmasked",
      "Internal reasoning vs visible answer, side by side",
      "Score: did you read the mind?",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28 border-t border-ink-line">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="kicker">
              <span className="dot-blink" />
              Protocol
            </div>
            <h2 className="font-mono text-3xl sm:text-4xl text-bone mt-4 tracking-tight">
              How a round works
            </h2>
          </div>
          <p className="max-w-md text-bone-dim">
            Three phases, ninety seconds total. Most of that is the trade.
            Most of the game is the questions.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {STEPS.map((s) => (
            <li
              key={s.step}
              className="bracketed bg-ink-panel/60 border border-ink-line p-6 relative group"
            >
              <span className="br-tr" aria-hidden />
              <span className="br-bl" aria-hidden />
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-acid crt text-lg tracking-[0.2em]">
                  {s.step}
                </span>
                <span className="label text-bone-dim">{s.duration}</span>
              </div>
              <h3 className="font-mono text-2xl text-bone mt-3">{s.title}</h3>
              <p className="mt-3 text-bone-dim leading-relaxed text-[0.95rem]">
                {s.body}
              </p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="font-mono text-[0.78rem] text-bone leading-relaxed flex gap-2"
                  >
                    <span className="text-acid-dim shrink-0">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
