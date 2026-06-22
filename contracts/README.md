# Contracts — `RoundLog`

`RoundLog.sol` is an append-only, on-chain record of finished rounds. The game's
**backend signer** (the contract owner) records each round; **players never sign
anything and never connect a wallet.**

The app works fine without this — settlement is optional and skipped until the
env vars below are set.

## One-time setup

You need a wallet **once**, only to deploy the contract and fund the signer. After
that, players never touch a wallet.

### 1. Get a Cosmos EVM testnet account + funds
- Add the target Cosmos EVM testnet to MetaMask (RPC URL + chain ID from the
  hackathon / chain docs).
- Fund the account from the testnet faucet.

### 2. Deploy `RoundLog.sol`
Easiest path, no local toolchain — [Remix](https://remix.ethereum.org):
1. New file → paste `RoundLog.sol`.
2. **Compile** (Solidity 0.8.20+).
3. **Deploy & Run** → Environment: *Injected Provider — MetaMask* (on the testnet) → **Deploy**.
4. Copy the deployed **contract address**.

The account that deploys becomes the `owner` — use that same account's private key
as the backend signer so it's allowed to call `recordRound`.

### 3. Configure the app (env)
Set these wherever the app runs (locally in `.env`, or in your host's env settings):

| Variable | Value |
| --- | --- |
| `COSMOS_EVM_RPC` | JSON-RPC URL of the testnet |
| `SETTLE_PRIVATE_KEY` | private key of the deployer/owner (keep secret) |
| `ROUNDLOG_ADDRESS` | deployed contract address |
| `EXPLORER_TX_URL` | explorer tx base URL, e.g. `https://explorer.example/tx` |

Redeploy. Finished rounds now write to `RoundLog`, and the reveal screen shows a
**"settled on-chain · view tx ↗"** link.

## How it's used
- `POST /api/settle` builds and broadcasts a `recordRound(...)` tx with the round
  outcome (agent, seed block, P&L ×100, mind-read, won), signed by the owner key.
- It returns the tx hash immediately (no wait for confirmation), so the reveal
  link appears fast.
- `GET /api/settle` reports whether settlement is configured.

## Notes / limitations
- The signer is custodial (the backend holds the key) — appropriate for a
  testnet demo. Production would add auth/rate-limiting on `/api/settle` and
  likely real player stakes.
- Amounts are stored scaled ×100 (two decimals) as `int256`.
