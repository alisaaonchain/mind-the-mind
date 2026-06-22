import { SampleReplay } from "@/components/SampleReplay";
import { Reveal } from "@/components/ui/Reveal";

export function SampleRound() {
  return (
    <section id="sample" className="relative border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Case file · Round replay</span>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                What it said vs. what it was thinking.
              </h2>
            </div>
            <p className="max-w-md text-ink-muted">
              Press play and scrub the 60 seconds. Left is the agent&apos;s hidden
              objective and its private reasoning, ticking by in real time. Right
              is everything you actually saw. The gap between them is the whole
              game.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <SampleReplay />
        </Reveal>
      </div>
    </section>
  );
}
