import { JsonRpcProvider, Wallet, Interface, encodeBytes32String } from "ethers";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Records a finished round on-chain via a backend signer (the contract owner).
// Players never sign. Everything is gated on env config; unconfigured or failed
// calls return { ok:false } and the reveal screen simply omits the link.

const ABI = [
  "function recordRound(uint64 seedBlock, bytes32 agent, int256 playerPnl, int256 agentPnl, bool mindRead, bool won) returns (uint256)",
];

function isConfigured(): boolean {
  return Boolean(
    process.env.COSMOS_EVM_RPC &&
      process.env.SETTLE_PRIVATE_KEY &&
      process.env.ROUNDLOG_ADDRESS,
  );
}

export async function GET() {
  return Response.json({
    enabled: isConfigured(),
    explorer: process.env.EXPLORER_TX_URL ?? null,
  });
}

type Body = {
  agent?: string;
  seedBlock?: number;
  playerPnl?: number;
  agentPnl?: number;
  mindRead?: boolean;
  won?: boolean;
};

const scaled = (n: unknown): bigint =>
  BigInt(Math.round(Number.isFinite(Number(n)) ? Number(n) * 100 : 0));

export async function POST(req: Request) {
  const rpc = process.env.COSMOS_EVM_RPC;
  const key = process.env.SETTLE_PRIVATE_KEY;
  const address = process.env.ROUNDLOG_ADDRESS;
  if (!rpc || !key || !address) {
    return Response.json({ ok: false, reason: "not_configured" });
  }

  // Abuse protection: per-IP and global per-instance caps protect the signer.
  if (
    !rateLimit(`settle:${clientIp(req)}`, 8, 60_000) ||
    !rateLimit("settle:global", 60, 60_000)
  ) {
    return Response.json({ ok: false, reason: "rate_limited" });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, reason: "bad_request" });
  }

  try {
    const provider = new JsonRpcProvider(rpc);
    const wallet = new Wallet(key, provider);
    const iface = new Interface(ABI);

    const agent = encodeBytes32String(String(body.agent ?? "").slice(0, 31));
    const seedBlock = BigInt(Math.max(0, Math.floor(Number(body.seedBlock) || 0)));

    const data = iface.encodeFunctionData("recordRound", [
      seedBlock,
      agent,
      scaled(body.playerPnl),
      scaled(body.agentPnl),
      Boolean(body.mindRead),
      Boolean(body.won),
    ]);

    // tx.hash is available as soon as it's broadcast; don't block on confirmation.
    const tx = await wallet.sendTransaction({ to: address, data });

    const explorer = process.env.EXPLORER_TX_URL
      ? `${process.env.EXPLORER_TX_URL.replace(/\/$/, "")}/${tx.hash}`
      : null;
    return Response.json({ ok: true, hash: tx.hash, explorer });
  } catch {
    return Response.json({ ok: false, reason: "tx_failed" });
  }
}
