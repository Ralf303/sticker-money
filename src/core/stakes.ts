export interface Stakes {
  id: number;
  jackpot: number;
  bar: number;
  berries: number;
  lemons: number;
  odd: number;
  correct: number;
}

export type StakeType =
  | "jackpot"
  | "bar"
  | "berries"
  | "lemons"
  | "odd"
  | "correct";

export type Logs = "cube" | "slots" | "up" | "down";
