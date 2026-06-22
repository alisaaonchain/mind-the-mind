"use client";

export type SettlePayload = {
  agent: string;
  seedBlock: number;
  playerPnl: number;
  agentPnl: number;
  mindRead: boolean;
  won: boolean;
};

export type SettleResult = {
  ok: boolean;
  hash?: string;
  explorer?: string | null;
  reason?: string;
};

// Asks the backend to record the round on-chain. Resolves { ok:false } on any
// failure or when settlement isn't configured, so the UI can simply skip it.
export async function settleRound(payload: SettlePayload): Promise<SettleResult> {
  try {
    const res = await fetch("/api/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false };
    return (await res.json()) as SettleResult;
  } catch {
    return { ok: false };
  }
}
