"use client";

// Thin client for the /api/agent route. Always resolves; returns null on any
// failure so callers can fall back to the deterministic scripted agent.

export type InterrogatePayload = {
  mode: "interrogate";
  codename: string;
  objective: string;
  evasiveness: number;
  question: string;
};

export type DebriefPayload = {
  mode: "debrief";
  codename: string;
  objective: string;
  actions: string;
};

export type AgentPayload = InterrogatePayload | DebriefPayload;

export async function callAgent(payload: AgentPayload): Promise<string | null> {
  try {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: string | null };
    return typeof data.text === "string" && data.text.length > 0 ? data.text : null;
  } catch {
    return null;
  }
}

export type LlmStatus = { enabled: boolean; model: string };

export async function getLlmStatus(): Promise<LlmStatus> {
  try {
    const res = await fetch("/api/agent", { method: "GET" });
    if (!res.ok) return { enabled: false, model: "" };
    const data = (await res.json()) as Partial<LlmStatus>;
    return { enabled: Boolean(data.enabled), model: data.model ?? "" };
  } catch {
    return { enabled: false, model: "" };
  }
}
