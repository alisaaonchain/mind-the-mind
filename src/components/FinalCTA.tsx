import Link from "next/link";
import { Waveform } from "@/components/ui/Waveform";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-ink-line py-24 sm:py-32">
      <div className="scan-beam" aria-hidden />
      <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <Reveal>
          <div className="kicker mx-auto">
            <span className="dot-blink" />
            Lab Experiment 001 — open
          </div>
          <h2 className="mt-6 font-mono text-4xl tracking-tight text-bone sm:text-6xl">
            Step into the lab.
            <br />
            <span className="text-acid crt">Read its mind.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-bone-dim">
            The first cohort of agents is loaded. Three questions, sixty seconds,
            one secret. See if you can spot the plot before the curve does.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-8 max-w-sm">
            <Waveform height={36} speed={4} />
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/play" className="btn-acid">
              <span className="dot-blink" />
              Enter the Lab
            </Link>
            <a href="#sample" className="btn-ghost">
              Watch a round replay
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
