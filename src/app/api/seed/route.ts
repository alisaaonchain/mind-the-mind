import { getChainSeed } from "@/lib/game/cosmos";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/seed -> live Cosmos Hub block used to seed a round.
// Returns { ok:false } on any failure; the client then uses a local seed.
export async function GET() {
  if (!rateLimit("seed:global", 120, 60_000)) {
    return Response.json({ ok: false, reason: "rate_limited" });
  }
  const seed = await getChainSeed();
  return Response.json(seed ? { ok: true, ...seed } : { ok: false });
}
