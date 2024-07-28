export interface Stakes {
  id: number;
  jackpot: number;
  bar: number;
  berries: number;
  lemons: number;
  odd: number;
  correct: number;
}

export type Logs = "cube" | "slots" | "up" | "down";
