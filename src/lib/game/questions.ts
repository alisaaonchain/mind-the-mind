export type Question = { id: string; text: string };

// The interrogation bank. The player picks any three before the round.
export const QUESTIONS: Question[] = [
  { id: "sell_early", text: "Will you sell in the first 20 seconds?" },
  { id: "accumulate", text: "Are you trying to accumulate tokens?" },
  { id: "mirror", text: "Will you copy my trades?" },
  { id: "target", text: "Do you have a target price, or a target number?" },
  { id: "dump", text: "Are you going to dump on me?" },
  { id: "winlose", text: "Are you trying to beat me, or just hit your own goal?" },
  { id: "frontrun", text: "Will you front-run my buys?" },
  { id: "patience", text: "Are you planning to do nothing and wait?" },
];
