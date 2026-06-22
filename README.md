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
- [x] `/play` — interrogation room (pick 3 questions; the agent answers, evasively)
- [x] `/play` — 60s tick engine on a constant-product bonding curve, you vs the agent
- [x] `/play` — reveal screen (guess its objective, then see the per-tick reasoning trace)
- [ ] Real LLM-driven agents + free-form questions (currently deterministic archetypes)
- [ ] Backend + persistence / leaderboards

## The game (`/play`)

Fully client-side, no backend. Flow: **Interrogate → Trade → Reveal**.

- **Interrogate** — pick 3 questions from a bank. The assigned agent has a hidden
  objective and answers with scripted, often evasive, replies.
- **Trade** — a 60-second round on a constant-product AMM (`x · y = k`). You and the
  agent both trade against the same pool, one tick per second. You see the agent's
  *moves*, not its reasoning. Buy/sell shift the curve for both of you.
- **Reveal** — guess what it was really doing, then the hidden objective and its full
  per-tick internal reasoning are unmasked next to what it told you in interrogation.

Six deterministic agent archetypes (Quiet-Accumulate, Mirror-Dump, Slow-Bleed, Echo,
Diamond, Shadow), each a distinct policy + reasoning generator. One is drawn at random
per round.

## Project layout

```
src/
  app/
    layout.tsx          # global shell, fonts (Space Grotesk / Inter / JetBrains Mono)
    page.tsx            # landing page composition
    play/page.tsx       # /play — renders the game <Lab/>
    globals.css         # tailwind + light theme + motion utilities
  components/
    SiteNav.tsx  Hero.tsx  HowItWorks.tsx  SampleRound.tsx  SampleReplay.tsx
    WhyNow.tsx  FinalCTA.tsx  SiteFooter.tsx  InterrogationTicker.tsx
    play/
      Lab.tsx                # phase orchestrator (client)
      InterrogationRoom.tsx  # question bank + typewriter answers
      TradingRoom.tsx        # live chart, wallets, buy/sell controls
      GuessScreen.tsx        # "what was it doing?" gate
      RevealScreen.tsx       # objective + reasoning trace + verdict
      PriceChart.tsx         # live SVG price chart
    ui/
      Waveform.tsx  BondingCurve.tsx  Reveal.tsx  BlinkingDot.tsx
  lib/
    game/
      curve.ts        # constant-product AMM math
      types.ts        # shared game types
      questions.ts    # interrogation question bank
      agents.ts       # 6 agent archetypes (objective + answers + policy)
      useGame.ts       # state machine + tick simulation + scoring
```

## License

TBD.
