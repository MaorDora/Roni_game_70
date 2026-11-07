import type { CellValue, GameAction, GameResult, GameState, Snapshot, Team } from "./types";

export const TEAMS: readonly Team[] = ["X", "O"];

export const DEFAULT_NAMES: Record<Team, string> = {
  X: "קבוצה א'",
  O: "קבוצה ב'"
};

export const MAX_NAME_LENGTH = 24;
export const MAX_HISTORY = 40;

const LINES: readonly (readonly number[])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export const otherTeam = (team: Team): Team => (team === "X" ? "O" : "X");

export const teamName = (state: GameState, team: Team): string =>
  state.names[team].trim() || DEFAULT_NAMES[team];

const emptyBoard = (): CellValue[] => [null, null, null, null, null, null, null, null, null];

export function createInitialState(): GameState {
  return {
    board: emptyBoard(),
    turn: "X",
    starter: "X",
    scores: { X: 0, O: 0 },
    names: { ...DEFAULT_NAMES },
    result: null,
    winLine: null,
    history: []
  };
}

/** Derives the round result from the board alone. */
export function evaluateBoard(board: readonly CellValue[]): { result: GameResult; winLine: readonly number[] | null } {
  for (const line of LINES) {
    const team = board[line[0]];
    if (team && team === board[line[1]] && team === board[line[2]]) return { result: team, winLine: line };
  }
  return { result: board.every(Boolean) ? "draw" : null, winLine: null };
}

const takeSnapshot = (s: GameState): Snapshot => ({
  board: [...s.board],
  turn: s.turn,
  starter: s.starter,
  scores: { ...s.scores },
  result: s.result,
  winLine: s.winLine
});

const withHistory = (s: GameState): Snapshot[] => [...s.history, takeSnapshot(s)].slice(-MAX_HISTORY);

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "place": {
      const { index, team } = action;
      if (state.result || !Number.isInteger(index) || index < 0 || index > 8 || state.board[index]) return state;
      const board = state.board.map((v, i) => (i === index ? team : v));
      const { result, winLine } = evaluateBoard(board);
      const won = result === "X" || result === "O";
      return {
        ...state,
        history: withHistory(state),
        board,
        turn: otherTeam(state.turn),
        result,
        winLine,
        scores: won ? { ...state.scores, [result]: state.scores[result] + 1 } : state.scores
      };
    }

    case "skip":
      if (state.result) return state;
      return { ...state, history: withHistory(state), turn: otherTeam(state.turn) };

    case "undo": {
      const previous = state.history[state.history.length - 1];
      if (!previous) return state;
      return { ...previous, names: state.names, history: state.history.slice(0, -1) };
    }

    case "newGame": {
      const starter = otherTeam(state.starter);
      return { ...state, board: emptyBoard(), starter, turn: starter, result: null, winLine: null, history: [] };
    }

    case "reset":
      return { ...createInitialState(), names: state.names };

    case "rename":
      return { ...state, names: { ...state.names, [action.team]: action.name.slice(0, MAX_NAME_LENGTH) } };
  }
}

// ---------- validation of persisted data ----------

const isTeam = (v: unknown): v is Team => v === "X" || v === "O";
const isCount = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0;
const asRecord = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;

function parseSnapshot(raw: unknown): Snapshot | null {
  const s = asRecord(raw);
  if (!s || !Array.isArray(s.board) || s.board.length !== 9) return null;
  if (!s.board.every((c) => c === null || isTeam(c))) return null;
  const scores = asRecord(s.scores);
  if (!scores || !isCount(scores.X) || !isCount(scores.O)) return null;
  if (!isTeam(s.turn) || !isTeam(s.starter)) return null;

  const board = s.board as CellValue[];
  return { board, turn: s.turn, starter: s.starter, scores: { X: scores.X, O: scores.O }, ...evaluateBoard(board) };
}

/** Rebuilds a safe GameState from anything found in storage; null if unusable. */
export function parseSavedState(raw: unknown): GameState | null {
  const snapshot = parseSnapshot(raw);
  if (!snapshot) return null;
  const s = raw as Record<string, unknown>;
  const names = asRecord(s.names);
  const name = (team: Team) =>
    typeof names?.[team] === "string" ? (names[team] as string).slice(0, MAX_NAME_LENGTH) : DEFAULT_NAMES[team];
  const history = Array.isArray(s.history)
    ? s.history.map(parseSnapshot).filter((h): h is Snapshot => h !== null).slice(-MAX_HISTORY)
    : [];

  return { ...snapshot, names: { X: name("X"), O: name("O") }, history };
}
