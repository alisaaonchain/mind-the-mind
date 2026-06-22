import Link from "next/link";
import { InterrogationTicker } from "@/components/InterrogationTicker";
import { Waveform } from "@/components/ui/Waveform";
import { BondingCurve } from "@/components/ui/BondingCurve";
import { Reveal } from "@/components/ui/Reveal";

const STATS: { label: string; value: string; suffix?: string }[] = [
  { label: "Questions", value: "3" },
  { label: "Round", value: "60", suffix: "s" },
  { label: "Hidden goals", value: "10+" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-32">
      {/* ambient bonding curve, low-opacity, top-right */}
      <BondingCurve className="pointer-events-none absolute -right-10 -top-10 h-[420px] w-[640px] opacity-[0.18] hidden lg:block" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="kicker">
                <span className="dot-blink" />
                Lab Experiment 001 / Mad Easy on Cosmos / Showcase Jun 22–29
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-6 font-mono text-[2.75rem] leading-[0.98] tracking-tight text-bone sm:text-6xl lg:text-[5rem]">
                <span className="block">It&apos;s plotting</span>
                <span
                  className="glitch block text-acid crt"
                  data-text="something."
                >
                  something.
                </span>
              </h1>
            </Reveal>

            {/* live brainwave under the headline */}
            <div className="mt-6 max-w-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="label text-acid-dim">subject.cortex // live</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-dim">
                  signal nominal
                </span>
              </div>
              <Waveform height={40} speed={5} />
            </div>

            <Reveal delay={120}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
                A 60-second trading game where the AI has a hidden objective.
                You get three questions before it acts. The AI must answer — but
                it can be evasive. Then both of you trade a bonding curve. After,
                its secret goal and per-tick reasoning are laid bare.{" "}
                <span className="text-bone">Reading its mind is how you win.</span>
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/play" className="btn-acid">
                  <span className="dot-blink" />
                  Enter the Lab
                </Link>
                <a href="#sample" className="btn-ghost">
                  Watch a round replay
                </a>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <dl className="mt-12 grid max-w-xl grid-cols-3 gap-3 sm:gap-5">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="bracketed relative border border-ink-line bg-ink-panel/60 p-4 sm:p-5"
                  >
                    <span className="br-tr" aria-hidden />
                    <span className="br-bl" aria-hidden />
                    <dt className="label">{s.label}</dt>
                    <dd className="mt-2 font-mono text-2xl text-acid crt sm:text-3xl">
                      {s.value}
                      {s.suffix ? (
                        <span className="ml-0.5 text-base text-bone-dim">
                          {s.suffix}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <InterrogationTicker />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
