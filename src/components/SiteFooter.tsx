import { BlinkingDot } from "@/components/ui/BlinkingDot";
import { Waveform } from "@/components/ui/Waveform";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-soft">
      <div className="opacity-50">
        <Waveform height={26} speed={9} tone="brand" calm />
      </div>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <BlinkingDot />
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                Mind the Mind
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              A 60-second adversarial trading game. Three questions, one hidden
              objective, full reasoning reveal at the end.
            </p>
          </div>

          <div>
            <div className="label mb-4">The experiment</div>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>Lab Experiment 001</li>
              <li>Adversarial AI trading game</li>
              <li>
                Status:{" "}
                <span className="font-medium text-brand">in testing</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="label mb-4">Lab</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/play"
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  /play — interrogation room
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/alisaaonchain/mind-the-mind"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  Source on GitHub ↗
                </a>
              </li>
              <li className="text-ink-muted">
                Status:{" "}
                <span className="font-medium text-brand">recruiting subjects</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline my-10" aria-hidden />

        <div className="flex flex-col justify-between gap-3 text-xs text-ink-faint sm:flex-row">
          <span>© {new Date().getFullYear()} Mind the Mind — Lab Experiment 001</span>
          <span className="flex items-center gap-2">
            <span className="dot" />
            All subjects observed. All transcripts retained.
          </span>
        </div>
      </div>
    </footer>
  );
}
