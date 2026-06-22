// Read-only live Cosmos chain data. No wallet, no key, no contract — just a
// public REST/LCD endpoint. Used to seed each round from real chain state so
// the round is genuinely anchored to Cosmos (and verifiable: every round shows
// the block height it was seeded from).

export type ChainSeed = {
  height: number;
  time: string;
  chainId: string;
  source: string;
};

const DEFAULT_LCD = "https://rest.cosmos.directory/cosmoshub";

export async function getChainSeed(): Promise<ChainSeed | null> {
  const base = (process.env.COSMOS_LCD ?? DEFAULT_LCD).replace(/\/$/, "");
  const url = `${base}/cosmos/base/tendermint/v1beta1/blocks/latest`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      block?: { header?: { height?: string; time?: string; chain_id?: string } };
    };
    const header = data.block?.header;
    const height = Number(header?.height);
    if (!Number.isFinite(height) || height <= 0) return null;
    return {
      height,
      time: header?.time ?? "",
      chainId: header?.chain_id ?? "cosmoshub-4",
      source: base,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
