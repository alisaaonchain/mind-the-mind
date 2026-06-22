import Link from "next/link";
import { Waveform } from "@/components/ui/Waveform";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="aurora opacity-70" aria-hidden>
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="badge mx-auto">
            <span className="dot animate-blink" />
            <span className="eyebrow">Lab Experiment 001 — open</span>
          </span>
          <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-6xl">
            Step into the lab.
            <br />
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              Read its mind.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            The first cohort of agents is loaded. Three questions, sixty seconds,
            one secret. See if you can spot the plot before the curve does.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-8 max-w-sm text-brand">
            <Waveform height={34} speed={4} tone="brand" />
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/play" className="btn-primary">
              Enter the Lab
              <span aria-hidden>→</span>
            </Link>
            <a href="#sample" className="btn-secondary">
              Watch a round replay
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
