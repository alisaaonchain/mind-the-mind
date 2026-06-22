<div align="center">

# Mind the Mind

### _It's plotting something._

**A 60-second trading game where an AI has a hidden objective.**
You get three questions before it acts. It must answer — but it can be evasive.
Then you both trade a bonding curve for 60 seconds. After the bell, its secret
objective and its per-tick private reasoning are laid bare next to what it told
you. **Reading its mind is how you win.**

[![CI](https://github.com/alisaaonchain/mind-the-mind/actions/workflows/ci.yml/badge.svg)](https://github.com/alisaaonchain/mind-the-mind/actions/workflows/ci.yml)
&nbsp;![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
&nbsp;![React](https://img.shields.io/badge/React-18-149ECA)
&nbsp;![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
&nbsp;![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8)

*Lab Experiment 001*

</div>

---

## Demo

> **Live:** _add your deployment URL here_ — the game is at `/play`.

On the live deployment the agent is driven by a real LLM (OpenRouter) and each
round is seeded from a live Cosmos Hub block. Both degrade gracefully, so the
game also runs with zero configuration.

---

## How a round works

A single round is three phases. Most of the clock is the trade; most of the
*game* is the questions.

| Phase | What happens |
| --- | --- |
| **1 · Interrogate** | A subject (an agent with a hidden objective) is assigned. You ask **three** questions from a bank. It must answer, but it can deflect, mislead, or feint — in proportion to its objective. |
| **2 · Trade** | A **60-second** round opens on a constant-product bonding curve (`x · y = k`). You and the agent trade the same pool, one tick per second. You see *what it does* — not *why*. |
| **3 · Reveal** | You call what it was really doing. Then its hidden objective, plan, and **full per-tick reasoning** are unmasked beside what it told you in interrogation. The gap between the two is the whole game. |

---

## How this maps to the hackathon judging

| Signal | How Mind the Mind addresses it |
| --- | --- |
| **Working prototype** | A complete, playable game at `/play`: briefing → interrogation → 60s trading → guess → reveal. CI builds, type-checks, and lints on every push (badge above). |
| **Creative mechanic** | You interrogate an AI with a *hidden objective*, trade against it, then see its private per-tick reasoning next to its public answers. The mechanic *is* the gap between what it said and what it thought. |
| **How AI is used** | A live LLM (OpenRouter) role-plays the agent — answering interrogation in character (evasive in proportion to its hidden objective) and delivering a first-person debrief at the reveal. Graceful fallback to scripted agents when no key is set. |
| **Cosmos relevance** | Every round is seeded from **live Cosmos Hub chain state** (read-only — no wallet, key, or contract). The latest block height selects your subject and is shown on-screen with a *"verify this block"* link. |
| **Incentive clarity** | An on-site Economics section spells out the loop (Stake → Interrogate → Trade → Reveal → Payout) and a payout that weights P&L **and** a correct mind-read. Worked example below. |

### Incentive — worked example

Buy in 100 credits. You finish the 60s with a trading P&L of **+18%** and you
**correctly call** the agent's hidden objective:

```
payout = stake × (1 + P&L) × mind-read multiplier
       = 100   × 1.18      × 1.5                 = 177
```

A *wrong* read drops the multiplier to ~1.0 — you keep your P&L but earn no read
bonus; a losing round with a wrong read forfeits to the pot. **The only durable
edge is reading the agent**, which is exactly the behaviour the payout rewards.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000  (game at /play)
```

Other scripts:

```bash
npm run build        # production build
npm run typecheck    # strict TypeScript, no emit
npm run lint         # next lint
```

The game is fully playable with **no configuration**. The two integrations
below are optional and both fall back cleanly.

### Optional: live LLM agent (OpenRouter)

```bash
cp .env.example .env
# set OPENROUTER_API_KEY, optionally OPENROUTER_MODEL
```

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys). Without it, the
agent uses deterministic scripted answers. On a host like Vercel, set the same
variables in the project's environment settings and redeploy.

### Optional: Cosmos endpoint

`COSMOS_LCD` overrides the public Cosmos REST/LCD endpoint used to seed rounds
(defaults to `https://rest.cosmos.directory/cosmoshub`). No key required.

---

## How the AI is used

A real model **role-plays the agent**, where it is most visible — never the trades.

- **Interrogation** — when you ask a question, the model answers *in character*
  as the agent, evasive in proportion to that agent's hidden objective, and
  never revealing the objective outright.
- **Reveal debrief** — a first-person confession of how it played you, generated
  from its actual move log.
- **The key stays server-side** — used only in the `/api/agent` route handler,
  never shipped to the client.
- **Graceful by design** — no key, an upstream failure, or a 9-second timeout
  all fall back to the scripted answer, so the game never breaks.

> Trading decisions stay **deterministic** — fast (1 Hz) and fair. The model
> drives the *language*, not the trades. This is a deliberate split: it keeps
> the 60-second round snappy and the outcome reproducible.

## Cosmos integration

Each round is anchored to **live Cosmos Hub chain state** — read-only, with no
wallet, key, or contract.

- `GET /api/seed` reads the latest block from a public Cosmos REST/LCD endpoint
  (`src/lib/game/cosmos.ts`).
- The block **height deterministically selects your subject** (`height % agents`),
  so the same block always yields the same agent — verifiable.
- The briefing screen shows the block with a **"verify this block ↗"** link, and
  a `Cosmos Hub · block #…` stamp persists through the round.
- If the endpoint is unreachable, it falls back to a local seed.

> A heavier follow-up — a **stake + settle contract on Cosmos EVM** — is on the
> roadmap; the read-only seed is the lightweight, honest first step.

---

## The agents

One of six archetypes is drawn each round (selected by the seed block). Each is a
distinct trading policy that doubles as a reasoning generator:

| Codename | Hidden objective |
| --- | --- |
| **Quiet-Accumulate** | Hold the most tokens of anyone at the bell. |
| **Mirror-Dump** | Pump the price early, then dump everything on you. |
| **Slow-Bleed** | Push the price down all round with small, steady sells. |
| **Echo** | Mirror whatever you do. |
| **Diamond** | One early buy, then hold no matter what. |
| **Shadow** | Front-run your buys and ride your slippage. |

---

## Tech stack

- **Framework:** Next.js 14.2 (App Router) · React 18 · TypeScript (`strict`, `noUncheckedIndexedAccess`)
- **Styling:** Tailwind CSS 3.4 — light theme, indigo (`#4F46E5`) brand + coral (`#FF6A3D`) accent
- **Type:** Space Grotesk (display) · Inter (body) · JetBrains Mono (data/logs), via `next/font/google`
- **Runtime integrations:** two serverless route handlers (`/api/agent`, `/api/seed`); no database
- **CI:** GitHub Actions — install, typecheck, lint, build on every push and PR

## Project layout

```
src/
  app/
    layout.tsx            # global shell + fonts
    page.tsx              # landing page
    globals.css           # Tailwind + design tokens + motion
    play/page.tsx         # /play — renders the game <Lab/>
    api/
      agent/route.ts      # OpenRouter proxy (interrogate + debrief)
      seed/route.ts       # live Cosmos Hub block
  components/
    SiteNav · Hero · HowItWorks · SampleRound · SampleReplay
    WhyNow · Incentives · FinalCTA · SiteFooter · InterrogationTicker
    play/
      Lab.tsx             # phase orchestrator (briefing→interrogate→trade→reveal)
      Briefing.tsx        # Cosmos seed + subject assignment
      InterrogationRoom   # question bank + live/typewritten answers
      TradingRoom         # live chart, wallets, buy/sell controls
      GuessScreen         # "what was it doing?" gate
      RevealScreen        # objective + reasoning trace + verdict + debrief
      PriceChart          # live SVG price chart
    ui/  Waveform · BondingCurve · Reveal · BlinkingDot
  lib/
    game/
      curve.ts            # constant-product AMM math
      agents.ts           # 6 archetypes (objective + answers + policy)
      questions.ts        # interrogation bank
      cosmos.ts           # live Cosmos Hub read
      llm.ts · seedClient.ts   # client fetchers
      useGame.ts          # state machine + tick simulation + scoring
      types.ts            # shared types
```

---

## Roadmap

- [x] Landing page
- [x] `/play` — interrogation, 60s bonding-curve round, reveal with reasoning trace
- [x] Live LLM agent (interrogation + debrief) via OpenRouter, with fallback
- [x] Cosmos relevance — rounds seeded from a live Cosmos Hub block (verifiable)
- [x] CI (build · typecheck · lint)
- [ ] Free-form interrogation questions (currently a curated bank)
- [ ] Stake + settle contract on Cosmos EVM
- [ ] Backend persistence + leaderboards / seasons

## License

TBD.
