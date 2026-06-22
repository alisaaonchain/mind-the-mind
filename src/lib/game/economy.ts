// Play-money economy (no real funds). Credits are a local, cosmetic balance so
// the incentive loop described on the landing is actually live in the game.

export const START_CREDITS = 1000;
export const STAKE = 100; // buy-in per round
export const READ_MULTIPLIER = 1.5; // payout bonus for a correct mind-read

/** payout = stake × (1 + P&L fraction) × mind-read multiplier */
export function payout(
  stake: number,
  pnlFraction: number,
  mindRead: boolean,
): number {
  const mult = mindRead ? READ_MULTIPLIER : 1;
  return stake * (1 + pnlFraction) * mult;
}
