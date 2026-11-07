import { useEffect, useReducer } from "react";
import { createInitialState, gameReducer, parseSavedState } from "./logic";
import type { GameState } from "./types";

const STORAGE_KEY = "roni70-game-v2";

// localStorage can be missing or throw (private mode, sandboxed iframes) – the game must still run.
function loadState(): GameState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return (raw && parseSavedState(JSON.parse(raw))) || createInitialState();
  } catch {
    return createInitialState();
  }
}

function saveState(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore – persistence is a nice-to-have
  }
}

/** Game state backed by localStorage, so a refresh mid-party loses nothing. */
export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState);

  useEffect(() => saveState(state), [state]);

  return [state, dispatch] as const;
}
