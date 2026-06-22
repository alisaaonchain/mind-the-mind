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
      <main className="relative overflow-hidden">
        <div className="aurora" aria-hidden>
          <div className="aurora-blob b1" />
          <div className="aurora-blob b2" />
        </div>

        <section className="relative min-h-[70vh] pb-28 pt-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <span className="badge">
              <span className="dot animate-blink" />
              <span className="eyebrow">Lab status · live</span>
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-6xl">
              The lab is being{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                calibrated.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              The interrogation room, the bonding curve, and the reveal screen are
              coming online next. While we wire them up, here&apos;s what the lab is
              doing right now.
            </p>

            <div className="mt-8 max-w-md text-brand">
              <Waveform height={36} speed={5} tone="brand" />
            </div>

            <div className="card mt-10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="label">Boot sequence</span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
                  /play · v0
                </span>
              </div>

              <ul className="space-y-1">
                {STATUS_LINES.map((s) => (
                  <li
                    key={s.label}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line py-3 last:border-b-0"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-ink">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${s.tone === "warn" ? "bg-accent" : "bg-brand"}`}
                      />
                      {s.label}
                    </span>
                    <span
                      className={`font-mono text-[0.78rem] ${s.tone === "warn" ? "text-accent-ink" : "text-brand"}`}
                    >
                      {s.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="hairline my-5" aria-hidden />
              <p className="font-mono text-[0.8rem] leading-relaxed text-ink-muted">
                <span className="text-brand">eta&gt;</span> Subjects ready
                imminently. Until then, read the case file or come back soon.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/#sample" className="btn-primary">
                Read the sample round
                <span aria-hidden>→</span>
              </Link>
              <Link href="/" className="btn-secondary">
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
