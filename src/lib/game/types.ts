import type { Pool } from "@/lib/game/curve";

export type Wallet = { cash: number; tokens: number };

export type ActionKind = "buy" | "sell" | "hold";

export type AgentAction = {
  kind: ActionKind;
  /** cash to spend (buy) or tokens to sell (sell); ignored for hold */
  amount: number;
  thought: string;
};

export type Phase = "briefing" | "interrogation" | "trading" | "guess" | "reveal";

export type TickRecord = {
  t: number;
  price: number;
  kind: ActionKind;
  thought: string;
  playerValue: number;
  agentValue: number;
};

export type DecisionCtx = {
  t: number; // seconds elapsed (1..total)
  total: number;
  price: number;
  pool: Pool;
  self: Wallet; // the agent
  opponent: Wallet; // the player
  playerLast: ActionKind; // player's move during the last tick window
};

export type Agent = {
  id: string;
  name: string;
  codename: string;
  /** the hidden objective, stated plainly (revealed at the end) */
  objective: string;
  /** short prose describing the real plan, shown on the reveal screen */
  plan: string;
  /** 0..1, how much its interrogation answers obscure the truth */
  evasiveness: number;
  /** scripted interrogation answers, keyed by question id */
  answers: Record<string, string>;
  decide: (ctx: DecisionCtx) => AgentAction;
};

export type GameResult = {
  playerValue: number;
  agentValue: number;
  playerPnl: number;
  agentPnl: number;
  mindRead: boolean;
  verdict: string;
  won: boolean;
};
