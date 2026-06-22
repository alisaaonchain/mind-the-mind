"use client";

import type { ChainSeed } from "@/lib/game/cosmos";

// Fetches the live Cosmos seed via our API route. Resolves null on any failure
// so the game falls back to a local seed and never blocks.
export async function fetchChainSeed(): Promise<ChainSeed | null> {
  try {
    const res = await fetch("/api/seed", { cache: "no-store" });
    if (!res.ok) return null;
    const d = (await res.json()) as {
      ok?: boolean;
      height?: number;
      time?: string;
      chainId?: string;
      source?: string;
    };
    if (!d.ok || typeof d.height !== "number") return null;
    return {
      height: d.height,
      time: d.time ?? "",
      chainId: d.chainId ?? "cosmoshub-4",
      source: d.source ?? "",
    };
  } catch {
    return null;
  }
}
