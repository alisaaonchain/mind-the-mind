import { Reveal } from "@/components/ui/Reveal";

type Note = { n: string; title: string; body: string };

const NOTES: Note[] = [
  {
    n: "01",
    title: "Trading is the perfect lie detector.",
    body: "Most AI demos let the model talk. We make it act. Words can equivocate; a curve cannot. Every tick is a forced commitment.",
  },
  {
    n: "02",
    title: "The reasoning trace is the show.",
    body: "Post-round you see the agent's per-tick internal monologue beside what it told you. The delta between the two is the actual product.",
  },
  {
    n: "03",
    title: "Adversarial alignment, in 60 seconds.",
    body: "Hidden goals. Asymmetric info. A real opponent. It compresses the whole 'is this thing aligned with me?' question into a round you can replay.",
  },
  {
    n: "04",
    title: "It's on-chain, but the question is universal.",
    body: "The bonding curve settles on-chain. The behaviour — agents with goals you can't see — is shipping everywhere right now. This is the cleanest sandbox to study it.",
  },
];

export function WhyNow() {
  return (
    <section id="why" className="relative border-t border-ink-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="kicker">
                <span className="dot-blink" />
                Thesis
              </div>
              <h2 className="mt-4 font-mono text-3xl tracking-tight text-bone sm:text-4xl">
                Why this experiment, why now.
              </h2>
            </div>
            <p className="text-[1.02rem] leading-relaxed text-bone-dim lg:col-span-7">
              Every week there&apos;s a new agent that talks great and acts weird.
              Mind the Mind makes that gap legible: a tiny adversarial game that
              forces the agent to act, then hands you the receipts.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {NOTES.map((n, i) => (
            <Reveal key={n.n} delay={i * 80}>
              <div className="bracketed relative h-full border border-ink-line bg-ink-panel/50 p-6">
                <span className="br-tr" aria-hidden />
                <span className="br-bl" aria-hidden />
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-mono text-sm tracking-[0.22em] text-acid crt">
                    {n.n}
                  </span>
                  <span className="hairline flex-1" aria-hidden />
                </div>
                <h3 className="font-mono text-xl leading-snug text-bone">{n.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-bone-dim">
                  {n.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
