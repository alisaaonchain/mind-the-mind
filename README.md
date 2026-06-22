# Mind the Mind

> Lab Experiment 001 — *It's plotting something.*

A 60-second trading game where an AI has a hidden objective. The player gets three questions before it acts. The AI must answer but can be evasive. Then both trade a bonding curve for 60 seconds. After, the secret objective is revealed alongside the AI's per-tick reasoning. Reading its mind is how you win.

---

## Demo

- **Live:** _add your Vercel URL here_ — the game runs at `/play`.
- Live LLM agent is enabled on the deployment (OpenRouter); rounds are seeded from live Cosmos Hub blocks.

## How this maps to the hackathon judging

| Signal | How Mind the Mind addresses it |
| --- | --- |
| **Working prototype** | A complete, playable game at `/play`: briefing → interrogation → 60s trading → guess → reveal. CI builds, typechecks, and lints on every push (see the badge / Actions tab). |
| **Creative mechanic** | You interrogate an AI with a *hidden objective*, trade a bonding curve against it for 60s, then see its per-tick private reasoning next to what it told you. The mechanic *is* the gap between what it said and what it thought. |
| **How AI is used** | A live LLM (via OpenRouter) role-plays the agent — it answers your interrogation in character, evasive in proportion to its hidden objective, and delivers a first-person debrief at the reveal. Graceful fallback to scripted agents when no key is set. |
| **Cosmos relevance** | Every round is seeded from **live Cosmos Hub chain state** — read-only, no wallet/key/contract. The latest block height selects your subject and is shown on-screen with a "verify this block" link. |
| **Incentive clarity** | An on-site Economics section spells out the loop (Stake → Interrogate → Trade → Reveal → Payout) and a payout that weights P&L *and* a correct mind-read. Worked example below. |

### Incentive — worked example

Buy-in: 100 credits into the round pot. You finish the 60s with a trading P&L of **+18%** and you **correctly call** the agent's hidden objective:

```
payout = stake × (1 + P&L) × mind-read multiplier
       = 100   × 1.18      × 1.5                 = 177
```

A *wrong* read drops the multiplier to ~1.0 (you keep your P&L, earn no read bonus); a losing round with a wrong read forfeits to the pot. The only durable edge is reading the agent.

---

## What's in this repo

The marketing landing page **and** the full playable game at `/play` (briefing → interrogation → 60s trading → reveal).

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

## Live LLM agent (optional)

By default the agent runs on deterministic scripted archetypes — no key needed.
Add an [OpenRouter](https://openrouter.ai/keys) key to have a real model role-play
the agent: it answers your interrogation questions in character (evasive in
proportion to the agent's hidden objective) and delivers a first-person "debrief"
on the reveal screen.

```bash
cp .env.example .env
# then set OPENROUTER_API_KEY (and optionally OPENROUTER_MODEL)
```

The key is used only server-side in the `/api/agent` route handler. Every call
degrades gracefully: no key, a failure, or a timeout falls back to the scripted
answer, so the game always works. Trading decisions stay deterministic (for
latency and fairness) — the model drives the *language*, not the trades.

## Cosmos integration

Each round is anchored to **live Cosmos Hub chain state** — read-only, no wallet, no key, no contract:

- On the briefing screen, the server route `GET /api/seed` reads the latest block from a public Cosmos REST/LCD endpoint (`src/lib/game/cosmos.ts`, default `https://rest.cosmos.directory/cosmoshub`, overridable via `COSMOS_LCD`).
- The block **height deterministically selects your subject** (`height % agents`), so the same block always yields the same agent — verifiable.
- The block is shown on-screen with a **"verify this block"** link straight to the chain, and a persistent `Cosmos Hub · block #…` stamp through the round.
- If the endpoint is unreachable, it falls back to a local seed — the game never blocks.

This is the lightweight, honest path to real Cosmos relevance. A heavier follow-up (a stake + settle contract on Cosmos EVM) is on the roadmap.

## Roadmap

- [x] Landing page
- [x] `/play` — interrogation room (pick 3 questions; the agent answers, evasively)
- [x] `/play` — 60s tick engine on a constant-product bonding curve, you vs the agent
- [x] `/play` — reveal screen (guess its objective, then see the per-tick reasoning trace)
- [x] Live LLM-driven agent answers + reveal debrief via OpenRouter (optional, with fallback)
- [x] Cosmos relevance — each round seeded from live Cosmos Hub block (read-only, verifiable)
- [ ] Free-form interrogation questions (currently a fixed bank)
- [ ] On-chain stake + settle contract on Cosmos EVM
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
