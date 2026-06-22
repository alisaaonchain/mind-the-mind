import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Waveform } from "@/components/ui/Waveform";

export const metadata: Metadata = {
  title: "/play — Lab being calibrated · Mind the Mind",
  description:
    "The interrogation room is being calibrated. Subjects loading shortly.",
};

const STATUS_LINES: { label: string; value: string; tone?: "ok" | "warn" }[] = [
  { label: "Tick engine", value: "warming · 60s round", tone: "warn" },
  { label: "Bonding curve", value: "shape: x·y=k · seeded", tone: "ok" },
  { label: "Subject pool", value: "10 agents / 10 hidden goals", tone: "ok" },
  { label: "Interrogation kernel", value: "drafting prompts", tone: "warn" },
  { label: "Reveal screen", value: "stitching reasoning trace", tone: "warn" },
];

export default function PlayPage() {
  return (
    <>
      <SiteNav />
      <main className="relative">
        <section className="relative pt-20 pb-28 min-h-[70vh]">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="kicker">
              <span className="dot-blink" />
              Lab status / live
            </div>
            <h1 className="font-mono text-4xl sm:text-6xl text-bone mt-6 tracking-tight leading-[1.05]">
              The lab is being{" "}
              <span className="text-acid crt">calibrated.</span>
            </h1>
            <p className="mt-6 max-w-xl text-bone-dim leading-relaxed">
              The interrogation room, the bonding curve, and the reveal screen
              are coming online next. While we wire them up, here&apos;s what
              the lab is doing right now.
            </p>

            <div className="mt-8 max-w-md opacity-80">
              <Waveform height={36} speed={5} tone="amber" />
            </div>

            <div className="mt-10 bracketed bg-ink-panel/60 border border-ink-line p-6 relative overflow-hidden">
              <span className="br-tr" aria-hidden />
              <span className="br-bl" aria-hidden />
              <div className="scan-beam" aria-hidden />
              <div className="flex items-center justify-between mb-4">
                <span className="label">Boot sequence</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
                  /play · v0
                </span>
              </div>

              <ul className="space-y-3">
                {STATUS_LINES.map((s) => (
                  <li
                    key={s.label}
                    className="grid grid-cols-[1fr_auto] gap-4 items-baseline border-b border-ink-line pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="font-mono text-sm text-bone">
                      <span className="text-acid-dim mr-2">›</span>
                      {s.label}
                    </span>
                    <span
                      className={`font-mono text-[0.78rem] uppercase tracking-[0.16em] ${
                        s.tone === "warn"
                          ? "text-amber-warn crt-amber"
                          : "text-acid crt"
                      }`}
                    >
                      {s.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="hairline my-5" aria-hidden />
              <p className="font-mono text-[0.78rem] text-bone-dim leading-relaxed">
                <span className="text-acid-dim">ETA&gt;</span> Subjects ready
                imminently. Until then, read the case file or come back soon.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/#sample" className="btn-acid">
                <span className="dot-blink" />
                Read the sample round
              </Link>
              <Link href="/" className="btn-ghost">
                ← Back to lobby
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
