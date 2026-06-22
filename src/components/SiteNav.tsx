import Link from "next/link";
import { BlinkingDot } from "@/components/ui/BlinkingDot";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <BlinkingDot />
            <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
              Mind the Mind
            </span>
            <span className="ml-1 hidden rounded-full border border-line px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint md:inline-block">
              Lab 001
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-muted md:flex">
            <a href="#how" className="transition-colors hover:text-ink">
              How it works
            </a>
            <a href="#sample" className="transition-colors hover:text-ink">
              Sample round
            </a>
            <a href="#why" className="transition-colors hover:text-ink">
              Why now
            </a>
            <a
              href="https://github.com/alisaaonchain/mind-the-mind"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              Source ↗
            </a>
          </nav>

          <Link href="/play" className="btn-primary">
            Enter the Lab
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
