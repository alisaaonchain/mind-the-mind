"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buy, price, sell, type Pool } from "@/lib/game/curve";
import {
  AGENTS,
  ROUND_SECONDS,
  START_POOL,
  START_WALLET,
} from "@/lib/game/agents";
import type { ChainSeed } from "@/lib/game/cosmos";
import type {
  ActionKind,
  Agent,
  GameResult,
  Phase,
  TickRecord,
  Wallet,
} from "@/lib/game/types";

export type Exchange = { q: string; a: string };

type State = {
  phase: Phase;
  agentIndex: number;
  seed: ChainSeed | null;
  transcript: Exchange[];
  pool: Pool;
  startValue: number;
  player: Wallet;
  agent: Wallet;
  t: number;
  history: TickRecord[];
  playerMove: ActionKind;
  guessId: string | null;
};

const value = (w: Wallet, p: Pool): number => w.cash + w.tokens * price(p);

function pickAgent(seed: ChainSeed | null): number {
  if (seed) return seed.height % AGENTS.length;
  return Math.floor(Math.random() * AGENTS.length);
}

// Opening price is seeded from the block height (~0.925–1.075), so the live
// chain state actually shapes the market, not just the agent selection.
function openPool(seed: ChainSeed | null): Pool {
  if (!seed) return { ...START_POOL };
  const drift = ((seed.height % 11) - 5) * 0.015;
  const openPrice = 1 + drift;
  return { rt: START_POOL.rt, rc: START_POOL.rt * openPrice };
}

function freshState(seed: ChainSeed | null): State {
  const pool = openPool(seed);
  return {
    phase: "briefing",
    agentIndex: pickAgent(seed),
    seed,
    transcript: [],
    pool,
    startValue: value(START_WALLET, pool),
    player: { ...START_WALLET },
    agent: { ...START_WALLET },
    t: 0,
    history: [],
    playerMove: "hold",
    guessId: null,
  };
}

function applyPlayerTrade(s: State, kind: "buy" | "sell", frac: number): State {
  if (s.phase !== "trading" || s.t >= ROUND_SECONDS) return s;
  if (kind === "buy") {
    const cash = s.player.cash * frac;
    if (cash <= 0.0001) return s;
    const { pool, tokensOut } = buy(s.pool, cash);
    return {
      ...s,
      pool,
      player: { cash: s.player.cash - cash, tokens: s.player.tokens + tokensOut },
      playerMove: "buy",
    };
  }
  const tokens = s.player.tokens * frac;
  if (tokens <= 0.0001) return s;
  const { pool, cashOut } = sell(s.pool, tokens);
  return {
    ...s,
    pool,
    player: { cash: s.player.cash + cashOut, tokens: s.player.tokens - tokens },
    playerMove: "sell",
  };
}

function applyTick(s: State): State {
  if (s.phase !== "trading") return s;
  const t = s.t + 1;
  const agent = AGENTS[s.agentIndex]!;
  const action = agent.decide({
    t,
    total: ROUND_SECONDS,
    price: price(s.pool),
    pool: s.pool,
    self: s.agent,
    opponent: s.player,
    playerLast: s.playerMove,
  });

  let pool = s.pool;
  let wallet = s.agent;
  if (action.kind === "buy") {
    const cash = Math.min(s.agent.cash, action.amount);
    if (cash > 0.0001) {
      const r = buy(pool, cash);
      pool = r.pool;
      wallet = { cash: s.agent.cash - cash, tokens: s.agent.tokens + r.tokensOut };
    }
  } else if (action.kind === "sell") {
    const tokens = Math.min(s.agent.tokens, action.amount);
    if (tokens > 0.0001) {
      const r = sell(pool, tokens);
      pool = r.pool;
      wallet = { cash: s.agent.cash + r.cashOut, tokens: s.agent.tokens - tokens };
    }
  }

  const p = price(pool);
  const record: TickRecord = {
    t,
    price: p,
    kind: action.kind,
    thought: action.thought,
    playerValue: value(s.player, pool),
    agentValue: value(wallet, pool),
  };

  return {
    ...s,
    pool,
    agent: wallet,
    t,
    history: [...s.history, record],
    playerMove: "hold",
    phase: t >= ROUND_SECONDS ? "guess" : "trading",
  };
}

export function useGame() {
  const [state, setState] = useState<State>(() => freshState(null));
  const setRef = useRef(setState);
  setRef.current = setState;

  useEffect(() => {
    if (state.phase !== "trading") return;
    const id = window.setInterval(() => setRef.current((s) => applyTick(s)), 1000);
    return () => window.clearInterval(id);
  }, [state.phase]);

  const applySeed = useCallback((seed: ChainSeed | null) => {
    setState((s) => {
      if (s.phase !== "briefing" || !seed) return s;
      const pool = openPool(seed);
      return {
        ...s,
        seed,
        agentIndex: pickAgent(seed),
        pool,
        startValue: value(START_WALLET, pool),
      };
    });
  }, []);

  const beginInterrogation = useCallback(() => {
    setState((s) => (s.phase === "briefing" ? { ...s, phase: "interrogation" } : s));
  }, []);

  const recordExchange = useCallback((q: string, a: string) => {
    setState((s) =>
      s.transcript.length >= 3 ? s : { ...s, transcript: [...s.transcript, { q, a }] },
    );
  }, []);

  const beginTrading = useCallback(() => {
    setState((s) => (s.transcript.length === 3 ? { ...s, phase: "trading" } : s));
  }, []);

  const trade = useCallback((kind: "buy" | "sell", frac: number) => {
    setState((s) => applyPlayerTrade(s, kind, frac));
  }, []);

  const submitGuess = useCallback((id: string) => {
    setState((s) => ({ ...s, guessId: id, phase: "reveal" }));
  }, []);

  const reset = useCallback(() => {
    setState(freshState(null));
  }, []);

  const agent: Agent = AGENTS[state.agentIndex]!;
  const currentPrice = price(state.pool);
  const playerValue = value(state.player, state.pool);
  const agentValue = value(state.agent, state.pool);

  let result: GameResult | null = null;
  if (state.phase === "reveal") {
    const mindRead = state.guessId === agent.id;
    const playerPnl = playerValue - state.startValue;
    const won = mindRead && playerPnl > 0;
    const verdict = mindRead
      ? playerPnl > 0
        ? "You read the mind — and traded it."
        : "Right read, wrong trades."
      : playerPnl > 0
        ? "Lucky profit. The mind stayed hidden."
        : "Outplayed. The mind stayed hidden.";
    result = {
      playerValue,
      agentValue,
      playerPnl,
      agentPnl: agentValue - state.startValue,
      mindRead,
      verdict,
      won,
    };
  }

  return {
    phase: state.phase,
    agent,
    seed: state.seed,
    transcript: state.transcript,
    t: state.t,
    secondsLeft: ROUND_SECONDS - state.t,
    history: state.history,
    pool: state.pool,
    price: currentPrice,
    player: state.player,
    agentWallet: state.agent,
    playerValue,
    agentValue,
    startValue: state.startValue,
    guessId: state.guessId,
    result,
    applySeed,
    beginInterrogation,
    recordExchange,
    beginTrading,
    trade,
    submitGuess,
    reset,
  };
}
