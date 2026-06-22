import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-ink-line overflow-hidden">
      <div className="scan-beam" aria-hidden />
      <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <div className="kicker mx-auto">
          <span className="dot-blink" />
          Lab Experiment 001 — open
        </div>
        <h2 className="font-mono text-4xl sm:text-6xl text-bone mt-6 tracking-tight">
          Step into the lab.
          <br />
          <span className="text-acid crt">Read its mind.</span>
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-bone-dim leading-relaxed">
          The first cohort of agents is loaded. Three questions, sixty
          seconds, one secret. See if you can spot the plot before the curve
          does.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/play" className="btn-acid">
            <span className="dot-blink" />
            Enter the Lab
          </Link>
          <a
            href="https://madscientists.io/hackathon"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            About the hackathon ↗
          </a>
        </div>
      </div>
    </section>
  );
}
