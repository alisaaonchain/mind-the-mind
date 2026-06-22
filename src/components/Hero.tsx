import Link from "next/link";
import { InterrogationTicker } from "@/components/InterrogationTicker";
import { Waveform } from "@/components/ui/Waveform";
import { Reveal } from "@/components/ui/Reveal";

const STATS: { label: string; value: string; suffix?: string }[] = [
  { label: "Questions", value: "3" },
  { label: "Round", value: "60", suffix: "s" },
  { label: "Hidden goals", value: "10" },
];

const GOALS = [
  "Accumulate quietly",
  "Slow bleed",
  "Pump then dump",
  "Mirror the operator",
  "Hold to the bell",
  "Front-run every buy",
  "Starve the curve",
  "Exit at 62%",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient aurora */}
      <div className="aurora" aria-hidden>
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="badge">
                <span className="dot animate-blink" />
                <span className="eyebrow">Lab Experiment 001</span>
                <span className="text-ink-faint">·</span>
                <span className="text-ink-muted">Adversarial AI trading game</span>
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-6 font-display text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.4rem]">
                It&apos;s plotting
                <br />
                <span className="bg-gradient-to-r from-brand via-brand to-accent bg-clip-text text-transparent">
                  something.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                A 60-second trading game where the AI has a hidden objective. You
                get three questions before it acts — it must answer, but it can be
                evasive. Then you both trade a bonding curve. After, its secret
                goal and per-tick reasoning are laid bare.{" "}
                <span className="font-medium text-ink">
                  Reading its mind is how you win.
                </span>
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/play" className="btn-primary">
                  Enter the Lab
                  <span aria-hidden>→</span>
                </Link>
                <a href="#sample" className="btn-secondary">
                  Watch a round replay
                </a>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="card p-4 sm:p-5">
                    <dt className="label">{s.label}</dt>
                    <dd className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-ink">
                      {s.value}
                      {s.suffix ? (
                        <span className="text-lg text-ink-faint">{s.suffix}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={140}>
              <InterrogationTicker />
            </Reveal>
          </div>
        </div>

        {/* live brainwave + scrolling goals */}
        <Reveal delay={120}>
          <div className="mt-16">
            <div className="mb-3 flex items-center justify-between">
              <span className="label">Subject pool · hidden objectives</span>
              <span className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="dot animate-blink" />
                cortex signal nominal
              </span>
            </div>
            <div className="mb-5 max-w-md">
              <div className="text-brand">
                <Waveform height={36} speed={5} tone="brand" />
              </div>
            </div>
            <div className="marquee-mask">
              <div className="marquee gap-3">
                {[...GOALS, ...GOALS].map((g, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-xs text-ink-muted"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
