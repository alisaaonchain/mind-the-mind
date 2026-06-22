import { Reveal } from "@/components/ui/Reveal";

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
    body: "Before any trade happens, you get three questions. The agent must respond. It cannot refuse — but it can be evasive, deflect, or feint.",
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
      "Your interrogation read is the only edge you get",
    ],
  },
  {
    step: "03",
    title: "Reveal",
    duration: "Verdict",
    body: "After the round its hidden objective is shown — alongside its per-tick reasoning. You see exactly what it was thinking versus what it told you.",
    bullets: [
      "Objective unmasked",
      "Inner reasoning vs visible answer, side by side",
      "Score: did you read the mind?",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-ink-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="kicker">
                <span className="dot-blink" />
                Protocol
              </div>
              <h2 className="mt-4 font-mono text-3xl tracking-tight text-bone sm:text-4xl">
                How a round works
              </h2>
            </div>
            <p className="max-w-md text-bone-dim">
              Three phases, ninety seconds total. Most of that is the trade. Most
              of the game is the questions.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 90}>
              <div className="bracketed group relative h-full border border-ink-line bg-ink-panel/60 p-6">
                <span className="br-tr" aria-hidden />
                <span className="br-bl" aria-hidden />
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-lg tracking-[0.2em] text-acid crt">
                    {s.step}
                  </span>
                  <span className="label text-bone-dim">{s.duration}</span>
                </div>
                <h3 className="mt-3 font-mono text-2xl text-bone">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-bone-dim">
                  {s.body}
                </p>
                <ul className="mt-5 space-y-2">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 font-mono text-[0.78rem] leading-relaxed text-bone"
                    >
                      <span className="shrink-0 text-acid-dim">›</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
