export type Team = "X" | "O";
export type CellValue = Team | null;
export type GameResult = Team | "draw" | null;

export interface GameState {
  board: CellValue[];
  turn: Team;
  /** Team that opened the current round; alternates every new round. */
  starter: Team;
  scores: Record<Team, number>;
  names: Record<Team, string>;
  result: GameResult;
  winLine: readonly number[] | null;
  history: Snapshot[];
}

/** Everything undo restores. Team names are deliberately excluded. */
export type Snapshot = Omit<GameState, "history" | "names">;

export type GameAction =
  | { type: "place"; index: number; team: Team }
  | { type: "skip" }
  | { type: "undo" }
  | { type: "newGame" }
  | { type: "reset" }
  | { type: "rename"; team: Team; name: string };
