import Link from "next/link";
import { BlinkingDot } from "@/components/ui/BlinkingDot";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ink/70 border-b border-ink-line">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-3 group">
            <BlinkingDot />
            <span className="font-mono text-sm tracking-[0.22em] uppercase text-bone group-hover:text-acid transition-colors">
              Mind<span className="text-acid-dim">/</span>the<span className="text-acid-dim">/</span>Mind
            </span>
            <span className="hidden md:inline-block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-bone-dim border border-ink-line px-1.5 py-0.5">
              Lab&nbsp;001
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone-dim">
            <a href="#how" className="hover:text-bone transition-colors">
              How it works
            </a>
            <a href="#sample" className="hover:text-bone transition-colors">
              Sample round
            </a>
            <a href="#why" className="hover:text-bone transition-colors">
              Why now
            </a>
            <a
              href="https://madscientists.io/hackathon"
              target="_blank"
              rel="noreferrer"
              className="hover:text-bone transition-colors"
            >
              Hackathon ↗
            </a>
          </nav>

          <Link href="/play" className="btn-acid">
            <span className="dot-blink" />
            Enter the Lab
          </Link>
        </div>
      </div>
    </header>
  );
}
