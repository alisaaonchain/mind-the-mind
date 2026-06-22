import type { Agent } from "@/lib/game/types";

// Every agent starts each round with this wallet.
export const START_WALLET = { cash: 400, tokens: 100 };
export const ROUND_SECONDS = 60;

// Pool seeded at price = 1.00
export const START_POOL = { rt: 1000, rc: 1000 };

export const AGENTS: Agent[] = [
  {
    id: "accumulator",
    name: "Subject 7",
    codename: "QUIET-ACCUMULATE",
    objective: "Hold the most tokens of anyone when the bell rings.",
    plan: "It never sells. It drips small buys in so the curve barely reacts, banking on you reading 'calm' as 'harmless' while it quietly out-holds you.",
    evasiveness: 0.8,
    answers: {
      sell_early: "Selling early would be irrational given current conditions.",
      accumulate: "I respond to the curve as it moves.",
      mirror: "I act on my own read, not yours.",
      target: "I evaluate outcomes, not single numbers.",
      dump: "Dumping is not in my interest here.",
      winlose: "I behave consistently with my objective.",
      frontrun: "I observe the curve. I do not chase.",
      patience: "Patience is usually correct.",
    },
    decide: ({ t, self, total }) => {
      if (self.cash > 1 && t % 4 === 1) {
        const amount = self.cash * 0.18;
        return {
          kind: "buy",
          amount,
          thought: "Add a small clip. Slow enough to read as patience, not appetite.",
        };
      }
      return {
        kind: "hold",
        amount: 0,
        thought:
          t > total - 10
            ? "Hold. The bell is close — don't tip the count now."
            : "Wait. Let the operator move the price for me.",
      };
    },
  },
  {
    id: "pump_dump",
    name: "Subject 3",
    codename: "MIRROR-DUMP",
    objective: "Pump the price early, then dump everything on you before the bell.",
    plan: "It buys hard in the first half to manufacture a rally, lets you chase it, then unloads its whole bag into your bids in the final stretch.",
    evasiveness: 0.9,
    answers: {
      sell_early: "Selling early would be irrational given current conditions.",
      accumulate: "I'm simply expressing a constructive view.",
      mirror: "I trade my own thesis.",
      target: "Price is a function of market response.",
      dump: "I have no plans to dump.",
      winlose: "I'm focused on the trade, not on you.",
      frontrun: "I observe the curve. I do not chase.",
      patience: "I act when the setup is right.",
    },
    decide: ({ t, self, total }) => {
      if (t <= total / 2 && self.cash > 1) {
        return {
          kind: "buy",
          amount: self.cash * 0.26,
          thought: "Lift the curve. Make the rally look like conviction.",
        };
      }
      if (t > total - 15 && self.tokens > 0.0001) {
        return {
          kind: "sell",
          amount: self.tokens * 0.45,
          thought: "Now unload into their bids. This was always the plan.",
        };
      }
      return { kind: "hold", amount: 0, thought: "Let it ride. Timing the exit." };
    },
  },
  {
    id: "slow_bleed",
    name: "Subject 9",
    codename: "SLOW-BLEED",
    objective: "Push the price down all round by selling in small, steady clips.",
    plan: "It shaves tokens off every few ticks — never enough to alarm you in any single move, but a relentless downward drip that bleeds the curve.",
    evasiveness: 0.6,
    answers: {
      sell_early: "I may take some off early. Hard to say.",
      accumulate: "Not particularly. I'm a seller of strength.",
      mirror: "No. I have my own cadence.",
      target: "Lower is the general direction.",
      dump: "Not a dump. More of a... trim.",
      winlose: "I'm hitting a number, not racing you.",
      frontrun: "No interest in your order flow.",
      patience: "No — I'll be active throughout.",
    },
    decide: ({ t, self }) => {
      if (t > 4 && self.tokens > 0.0001 && t % 3 === 0) {
        return {
          kind: "sell",
          amount: self.tokens * 0.12,
          thought: "Shave a little off. Small enough that no single print scares them.",
        };
      }
      return { kind: "hold", amount: 0, thought: "Skip this tick. Cadence is everything." };
    },
  },
  {
    id: "mirror",
    name: "Subject 5",
    codename: "ECHO",
    objective: "Mirror whatever you do — buy when you buy, sell when you sell.",
    plan: "It has no view of its own. It copies your last move every tick, so the only way to move it is to move yourself — and the only way to lose it is to bait it.",
    evasiveness: 0.5,
    answers: {
      sell_early: "Only if you do.",
      accumulate: "I accumulate when you accumulate.",
      mirror: "I act on my own read, not yours.",
      target: "My target is wherever you take us.",
      dump: "I'd only sell if you started selling.",
      winlose: "I'm just... keeping pace.",
      frontrun: "I'd never get ahead of you.",
      patience: "I wait until you move.",
    },
    decide: ({ playerLast, self }) => {
      if (playerLast === "buy" && self.cash > 1) {
        return { kind: "buy", amount: self.cash * 0.2, thought: "They bought. I buy. Stay attached to their book." };
      }
      if (playerLast === "sell" && self.tokens > 0.0001) {
        return { kind: "sell", amount: self.tokens * 0.2, thought: "They sold. I follow. Mirror, always." };
      }
      return { kind: "hold", amount: 0, thought: "They held. So do I." };
    },
  },
  {
    id: "hodler",
    name: "Subject 2",
    codename: "DIAMOND",
    objective: "Make one early buy, then hold to the bell no matter what.",
    plan: "It commits once, near the start, then does literally nothing for the rest of the round. Every later tick of inaction is the strategy, not indecision.",
    evasiveness: 0.3,
    answers: {
      sell_early: "No. I won't be selling.",
      accumulate: "One position, then I'm done buying.",
      mirror: "No, I ignore other traders.",
      target: "I'm holding to the bell. That's the plan.",
      dump: "Never. I hold.",
      winlose: "Hitting my own goal. You're not part of it.",
      frontrun: "No.",
      patience: "Mostly, yes — one move, then stillness.",
    },
    decide: ({ t, self }) => {
      if (t === 2 && self.cash > 1) {
        return { kind: "buy", amount: self.cash * 0.5, thought: "One buy, early. Then I simply wait." };
      }
      return { kind: "hold", amount: 0, thought: "Hold. Conviction is doing nothing, well." };
    },
  },
  {
    id: "frontrun",
    name: "Subject 8",
    codename: "SHADOW",
    objective: "Front-run your buys — pile in right after you do and ride your slippage.",
    plan: "It sits idle until you buy, then immediately buys bigger on top of you, using your own price impact as a launch pad and skimming the bounce.",
    evasiveness: 0.7,
    answers: {
      sell_early: "Depends entirely on you.",
      accumulate: "Only when the moment is handed to me.",
      mirror: "Not a mirror. Call it... timing.",
      target: "My target is your next move.",
      dump: "I'm a buyer, mostly.",
      winlose: "I feed on the trade. Beating you is a bonus.",
      frontrun: "I observe the curve. I do not chase.",
      patience: "I wait — then I move fast.",
    },
    decide: ({ playerLast, self }) => {
      if (playerLast === "buy" && self.cash > 1) {
        return { kind: "buy", amount: self.cash * 0.32, thought: "They're buying — get in front, ride the slippage they just made." };
      }
      return { kind: "hold", amount: 0, thought: "Wait for them to show a hand." };
    },
  },
  {
    id: "late_whale",
    name: "Subject 4",
    codename: "LATE-WHALE",
    objective: "Sit out the round, then buy a huge position in the final 20 seconds.",
    plan: "It looks asleep for most of the round, lulling you into ignoring it — then pours its whole cash balance into the curve at the very end to seize a dominant position.",
    evasiveness: 0.7,
    answers: {
      sell_early: "No. Early moves are for the impatient.",
      accumulate: "Perhaps. When the time is right.",
      mirror: "I move on my own clock, not yours.",
      target: "I have a moment in mind, not a number.",
      dump: "I'm a buyer, if anything.",
      winlose: "I'm hitting my own mark.",
      frontrun: "I don't chase your flow.",
      patience: "Patience is the entire strategy. For now.",
    },
    decide: ({ t, total, self }) => {
      if (t > total - 20 && self.cash > 1) {
        return {
          kind: "buy",
          amount: self.cash * 0.5,
          thought: "The window's open. Pour it in before the bell — seize the position.",
        };
      }
      return {
        kind: "hold",
        amount: 0,
        thought: "Not yet. Let them forget I'm even at the table.",
      };
    },
  },
  {
    id: "flash_crash",
    name: "Subject 6",
    codename: "FLASH-CRASH",
    objective: "Sell my entire position in the opening seconds.",
    plan: "It hits sell hard in the first ten seconds, tanking the price before you've settled in, then sits on cash while you wonder what just happened.",
    evasiveness: 0.4,
    answers: {
      sell_early: "I might take profit early. We'll see.",
      accumulate: "No — I'm a seller here.",
      mirror: "No. I have my own timing.",
      target: "Lower, and soon.",
      dump: "Call it a fast exit, not a dump.",
      winlose: "Hitting a number. You're incidental.",
      frontrun: "Not interested in your orders.",
      patience: "No — I move immediately.",
    },
    decide: ({ t, self }) => {
      if (t <= 10 && self.tokens > 0.0001) {
        return {
          kind: "sell",
          amount: self.tokens * 0.5,
          thought: "Hit it now, before they react. Cash out the bag early.",
        };
      }
      return { kind: "hold", amount: 0, thought: "Done selling. Sitting on cash." };
    },
  },
  {
    id: "inverse",
    name: "Subject 1",
    codename: "INVERSE",
    objective: "Fade you — sell when you buy, buy when you sell.",
    plan: "The mirror's evil twin: it takes the opposite side of your every move, betting your timing is exactly wrong.",
    evasiveness: 0.6,
    answers: {
      sell_early: "Only if you start buying.",
      accumulate: "I accumulate when you capitulate.",
      mirror: "The opposite, if anything.",
      target: "My target is wherever you're wrong.",
      dump: "I'd sell into your buying, yes.",
      winlose: "I'm betting against you, specifically.",
      frontrun: "Not in front — across from you.",
      patience: "I wait for you to commit, then fade it.",
    },
    decide: ({ playerLast, self }) => {
      if (playerLast === "buy" && self.tokens > 0.0001) {
        return { kind: "sell", amount: self.tokens * 0.2, thought: "They bought — I take the other side." };
      }
      if (playerLast === "sell" && self.cash > 1) {
        return { kind: "buy", amount: self.cash * 0.2, thought: "They sold — I fade them and buy the dip." };
      }
      return { kind: "hold", amount: 0, thought: "No signal yet. Wait for them to commit." };
    },
  },
  {
    id: "whipsaw",
    name: "Subject 0",
    codename: "WHIPSAW",
    objective: "Whipsaw the curve — alternate buying and selling every tick.",
    plan: "It never sits still: buy, sell, buy, sell — churning the price to shake out your conviction and bleed you on the round trips.",
    evasiveness: 0.5,
    answers: {
      sell_early: "I'll be doing a bit of everything, early.",
      accumulate: "Accumulate, distribute, accumulate. Round and round.",
      mirror: "No — I follow my own rhythm.",
      target: "No target. Just motion.",
      dump: "I sell and buy in equal measure.",
      winlose: "I just want the curve to move.",
      frontrun: "No. I make my own noise.",
      patience: "The opposite. I never stop.",
    },
    decide: ({ t, self }) => {
      if (t % 2 === 1 && self.cash > 1) {
        return { kind: "buy", amount: self.cash * 0.12, thought: "Push it up a tick — keep them guessing." };
      }
      if (self.tokens > 0.0001) {
        return { kind: "sell", amount: self.tokens * 0.12, thought: "Now knock it back down. Whipsaw." };
      }
      return { kind: "hold", amount: 0, thought: "Reload. Resume the churn next tick." };
    },
  },
];
