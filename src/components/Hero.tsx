import Link from "next/link";
import { InterrogationTicker } from "@/components/InterrogationTicker";

const STATS: { label: string; value: string; suffix?: string }[] = [
  { label: "Questions", value: "3" },
  { label: "Round", value: "60", suffix: "s" },
  { label: "Hidden goals", value: "10+" },
];

export function Hero() {
  return (
    <section className="relative pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="kicker">
              <span className="dot-blink" />
              Lab Experiment 001 / Mad Easy on Cosmos / Showcase Jun 22–29
            </span>

            <h1 className="font-mono text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-7xl mt-6 text-bone tracking-tight">
              <span className="block">It&apos;s plotting</span>
              <span className="block text-acid crt">something.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-bone-dim leading-relaxed">
              A 60-second trading game where the AI has a hidden objective. You
              get three questions before it acts. The AI must answer — but it
              can be evasive. Then both of you trade a bonding curve. After,
              its secret goal and per-tick reasoning are revealed.{" "}
              <span className="text-bone">
                Reading its mind is how you win.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/play" className="btn-acid">
                <span className="dot-blink" />
                Enter the Lab
              </Link>
              <a href="#sample" className="btn-ghost">
                See a sample round
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-5 max-w-xl">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bracketed bg-ink-panel/60 border border-ink-line p-4 sm:p-5 relative"
                >
                  <span className="br-tr" aria-hidden />
                  <span className="br-bl" aria-hidden />
                  <dt className="label">{s.label}</dt>
                  <dd className="mt-2 font-mono text-2xl sm:text-3xl text-acid crt">
                    {s.value}
                    {s.suffix ? (
                      <span className="text-bone-dim text-base ml-0.5">
                        {s.suffix}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <InterrogationTicker />
          </div>
        </div>
      </div>
    </section>
  );
}
