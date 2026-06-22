type Note = {
  n: string;
  title: string;
  body: string;
};

const NOTES: Note[] = [
  {
    n: "01",
    title: "Trading is the perfect lie detector.",
    body: "Most AI demos let the model talk. We let the model act. Words can equivocate; a curve cannot. Every tick is a forced commitment.",
  },
  {
    n: "02",
    title: "The reasoning trace is the show.",
    body: "Post-round, you see the agent's per-tick internal monologue alongside what it told you. The delta between the two is the actual product.",
  },
  {
    n: "03",
    title: "Adversarial alignment, in 60 seconds.",
    body: "Hidden goals. Asymmetric info. A real opponent. It compresses the entire 'is this thing aligned with me?' question into a round you can replay.",
  },
  {
    n: "04",
    title: "Built for Cosmos, but the question is universal.",
    body: "The bonding curve runs on Mad Easy on Cosmos. The behavior — agents with goals you can't see — is everywhere shipping right now. This is the cleanest sandbox to study it.",
  },
];

export function WhyNow() {
  return (
    <section
      id="why"
      className="relative py-20 sm:py-28 border-t border-ink-line"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-5">
            <div className="kicker">
              <span className="dot-blink" />
              Thesis
            </div>
            <h2 className="font-mono text-3xl sm:text-4xl text-bone mt-4 tracking-tight">
              Why this experiment, why now.
            </h2>
          </div>
          <p className="lg:col-span-7 text-bone-dim leading-relaxed text-[1.02rem]">
            Every week there&apos;s a new agent that talks great and acts
            weird. Mind the Mind makes that gap legible: a tiny adversarial
            game that forces the agent to act, then shows you the receipts.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 gap-5">
          {NOTES.map((n) => (
            <li
              key={n.n}
              className="bracketed bg-ink-panel/50 border border-ink-line p-6 relative"
            >
              <span className="br-tr" aria-hidden />
              <span className="br-bl" aria-hidden />
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-acid crt text-sm tracking-[0.22em]">
                  {n.n}
                </span>
                <span className="hairline flex-1" aria-hidden />
              </div>
              <h3 className="font-mono text-xl text-bone leading-snug">
                {n.title}
              </h3>
              <p className="mt-3 text-bone-dim leading-relaxed text-[0.95rem]">
                {n.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
