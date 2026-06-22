import { Reveal } from "@/components/ui/Reveal";

const LOOP = ["Stake", "Interrogate", "Trade", "Reveal", "Payout"];

type Card = { title: string; body: string };

const CARDS: Card[] = [
  {
    title: "Skin in the game",
    body: "Every round takes a buy-in into a shared pot on the bonding curve. Your trades move a real price and your P&L is real — not a cosmetic score.",
  },
  {
    title: "Reading beats luck",
    body: "Payout weights two things: your P&L and whether you correctly called the agent's hidden objective. Profit without a read pays little; a clean read multiplies it. Bad reads forfeit to the pot.",
  },
  {
    title: "The lab compounds",
    body: "A small curve fee on every round seeds new agents and hidden objectives, funds the leaderboard, and runs seasonal resets. More players means richer pots and harder minds.",
  },
];

export function Incentives() {
  return (
    <section id="economics" className="relative border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">Economics</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.6rem]">
              The incentive loop
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Why people play, why it pays, and why the lab keeps running. One loop,
              settled on-chain so stakes, payouts, and the leaderboard are verifiable.
            </p>
          </div>
        </Reveal>

        {/* the loop */}
        <Reveal delay={60}>
          <div className="mb-10 flex flex-wrap items-center gap-2">
            {LOOP.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  <span className="mr-1.5 text-brand">{i + 1}</span>
                  {step}
                </span>
                {i < LOOP.length - 1 ? (
                  <span className="text-ink-faint" aria-hidden>
                    →
                  </span>
                ) : (
                  <span className="font-mono text-xs text-ink-faint" aria-hidden>
                    ↺
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="card card-hover h-full p-7">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                  {c.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint">
            Net effect: the only durable edge is reading the agent. You can&apos;t
            grind, you can&apos;t brute-force the curve — you have to understand what
            the thing across the table actually wants. That is the product, and it is
            what the payout rewards.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
