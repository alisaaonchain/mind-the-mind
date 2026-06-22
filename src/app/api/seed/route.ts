import { getChainSeed } from "@/lib/game/cosmos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/seed -> live Cosmos Hub block used to seed a round.
// Returns { ok:false } on any failure; the client then uses a local seed.
export async function GET() {
  const seed = await getChainSeed();
  return Response.json(seed ? { ok: true, ...seed } : { ok: false });
}
