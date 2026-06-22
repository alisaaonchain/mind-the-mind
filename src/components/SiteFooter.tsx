import { BlinkingDot } from "@/components/ui/BlinkingDot";
import { Waveform } from "@/components/ui/Waveform";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line bg-ink-deep/60">
      <div className="opacity-30">
        <Waveform height={28} speed={8} calm />
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <BlinkingDot />
              <span className="font-mono text-sm tracking-[0.22em] uppercase text-bone">
                Mind<span className="text-acid-dim">/</span>the
                <span className="text-acid-dim">/</span>Mind
              </span>
            </div>
            <p className="mt-4 text-bone-dim text-sm leading-relaxed max-w-xs">
              A 60-second adversarial trading game. Three questions, one
              hidden objective, full reasoning reveal at the end.
            </p>
          </div>

          <div>
            <div className="label mb-3">Hackathon</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://madscientists.io/hackathon"
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone hover:text-acid transition-colors"
                >
                  Mad Easy on Cosmos ↗
                </a>
              </li>
              <li className="text-bone-dim">Showcase: Jun 22 — Jun 29, 2026</li>
              <li className="text-bone-dim">Track: AI agents / on-chain</li>
            </ul>
          </div>

          <div>
            <div className="label mb-3">Lab</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/play"
                  className="text-bone hover:text-acid transition-colors"
                >
                  /play — interrogation room
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/alisaaonchain/mind-the-mind"
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone hover:text-acid transition-colors"
                >
                  Source on GitHub ↗
                </a>
              </li>
              <li className="text-bone-dim">
                Status: <span className="text-acid">recruiting subjects</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12 mb-6" aria-hidden />

        <div className="flex flex-col sm:flex-row justify-between gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone-dim">
          <span>
            © {new Date().getFullYear()} Mind the Mind — Lab Experiment 001
          </span>
          <span className="flex items-center gap-2">
            <span className="dot-blink" />
            All subjects observed. All transcripts retained.
          </span>
        </div>
      </div>
    </footer>
  );
}
