"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buy, price, sell, type Pool } from "@/lib/game/curve";
import {
  AGENTS,
  ROUND_SECONDS,
  START_POOL,
  START_WALLET,
} from "@/lib/game/agents";
import type {
  ActionKind,
  Agent,
  GameResult,
  Phase,
  TickRecord,
  Wallet,
} from "@/lib/game/types";

type State = {
  phase: Phase;
  agentIndex: number;
  asked: string[];
  pool: Pool;
  player: Wallet;
  agent: Wallet;
  t: number;
  history: TickRecord[];
  playerMove: ActionKind;
  guessId: string | null;
};

const value = (w: Wallet, p: Pool): number => w.cash + w.tokens * price(p);
const START_VALUE = START_WALLET.cash + START_WALLET.tokens * price(START_POOL);

function freshState(agentIndex: number): State {
  return {
    phase: "interrogation",
    agentIndex,
    asked: [],
    pool: { ...START_POOL },
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
  const [state, setState] = useState<State>(() =>
    freshState(Math.floor(Math.random() * AGENTS.length)),
  );
  const setRef = useRef(setState);
  setRef.current = setState;

  // tick loop while trading
  useEffect(() => {
    if (state.phase !== "trading") return;
    const id = window.setInterval(() => setRef.current((s) => applyTick(s)), 1000);
    return () => window.clearInterval(id);
  }, [state.phase]);

  const askQuestion = useCallback((qId: string) => {
    setState((s) =>
      s.asked.includes(qId) || s.asked.length >= 3
        ? s
        : { ...s, asked: [...s.asked, qId] },
    );
  }, []);

  const beginTrading = useCallback(() => {
    setState((s) => (s.asked.length === 3 ? { ...s, phase: "trading" } : s));
  }, []);

  const trade = useCallback((kind: "buy" | "sell", frac: number) => {
    setState((s) => applyPlayerTrade(s, kind, frac));
  }, []);

  const submitGuess = useCallback((id: string) => {
    setState((s) => ({ ...s, guessId: id, phase: "reveal" }));
  }, []);

  const reset = useCallback(() => {
    setState(freshState(Math.floor(Math.random() * AGENTS.length)));
  }, []);

  const agent: Agent = AGENTS[state.agentIndex]!;
  const currentPrice = price(state.pool);
  const playerValue = value(state.player, state.pool);
  const agentValue = value(state.agent, state.pool);

  let result: GameResult | null = null;
  if (state.phase === "reveal") {
    const mindRead = state.guessId === agent.id;
    const playerPnl = playerValue - START_VALUE;
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
      agentPnl: agentValue - START_VALUE,
      mindRead,
      verdict,
      won,
    };
  }

  return {
    phase: state.phase,
    agent,
    asked: state.asked,
    t: state.t,
    secondsLeft: ROUND_SECONDS - state.t,
    history: state.history,
    pool: state.pool,
    price: currentPrice,
    player: state.player,
    agentWallet: state.agent,
    playerValue,
    agentValue,
    startValue: START_VALUE,
    guessId: state.guessId,
    result,
    askQuestion,
    beginTrading,
    trade,
    submitGuess,
    reset,
  };
}
