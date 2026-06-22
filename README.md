# Mind the Mind

> Lab Experiment 001 — *It's plotting something.*

A 60-second trading game where an AI has a hidden objective. The player gets three questions before it acts. The AI must answer but can be evasive. Then both trade a bonding curve for 60 seconds. After, the secret objective is revealed alongside the AI's per-tick reasoning. Reading its mind is how you win.

---

## What's in this repo

This is the public landing page. The `/play` route is a stub for now — the dashboard (interrogation room → 60s trading round → reveal) is shipping next.

- **Stack:** Next.js 14.2 (App Router), React 18, TypeScript (strict), Tailwind 3.4
- **Fonts:** JetBrains Mono (headings), Inter (body) — both via `next/font/google`
- **No backend yet** — the landing page is fully static aside from a single client component (the cycling interrogation transcript in the hero).

## Aesthetic

Mad scientist lab terminal. Dark teal-black background (`#0A1014`), acid lab green (`#9FFF6B`) and warning amber (`#FFB347`) accents. Subtle scanline overlay, CRT glow on green text, corner-bracket framing on key panels, slight grain. Not corporate.

## Local dev

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build      # production build
npm run typecheck  # strict TS check
npm run lint       # next lint
```

## Roadmap

- [x] Landing page
- [ ] `/play` — interrogation room (3 questions to an agent with a hidden objective)
- [ ] `/play` — 60s tick engine on a bonding curve, you vs the agent
- [ ] `/play` — reveal screen (hidden objective + per-tick reasoning trace)

## Project layout

```
src/
  app/
    layout.tsx          # global shell, fonts, scanline overlay
    page.tsx            # landing page composition
    play/page.tsx       # /play stub (lab being calibrated)
    globals.css         # tailwind + scanlines + grain + CRT glow
  components/
    SiteNav.tsx
    Hero.tsx
    HowItWorks.tsx
    SampleRound.tsx
    WhyNow.tsx
    FinalCTA.tsx
    SiteFooter.tsx
    InterrogationTicker.tsx  # client — cycling transcript
    ui/
      CornerFrame.tsx        # corner-bracket panel chrome
      BlinkingDot.tsx
```

## License

TBD.
