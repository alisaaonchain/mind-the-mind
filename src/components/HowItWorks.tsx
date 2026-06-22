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
    <section id="how" className="relative border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Protocol</span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                How a round works
              </h2>
            </div>
            <p className="max-w-md text-ink-muted">
              Three phases, ninety seconds total. Most of that is the trade. Most
              of the game is the questions.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 90}>
              <div className="card card-hover h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft font-display text-sm font-semibold text-brand">
                    {s.step}
                  </span>
                  <span className="label">{s.duration}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
                  {s.body}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2.5 text-sm leading-snug text-ink-soft"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
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
