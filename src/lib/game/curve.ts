// Constant-product bonding curve (x * y = k).
// rt = token reserve, rc = collateral/cash reserve. price = rc / rt.

export type Pool = { rt: number; rc: number };

export const price = (p: Pool): number => p.rc / p.rt;
export const invariant = (p: Pool): number => p.rt * p.rc;

/** Spend `cash` to buy tokens out of the pool. */
export function buy(p: Pool, cash: number): { pool: Pool; tokensOut: number } {
  if (cash <= 0) return { pool: p, tokensOut: 0 };
  const k = invariant(p);
  const rc = p.rc + cash;
  const rt = k / rc;
  return { pool: { rt, rc }, tokensOut: p.rt - rt };
}

/** Sell `tokens` into the pool for cash. */
export function sell(p: Pool, tokens: number): { pool: Pool; cashOut: number } {
  if (tokens <= 0) return { pool: p, cashOut: 0 };
  const k = invariant(p);
  const rt = p.rt + tokens;
  const rc = k / rt;
  return { pool: { rt, rc }, cashOut: p.rc - rc };
}
