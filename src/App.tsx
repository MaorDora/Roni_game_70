import { useCallback, useEffect, useRef, useState } from "react";
import { Board } from "./components/Board";
import { QuestionDialog } from "./components/QuestionDialog";
import { ResultDialog } from "./components/ResultDialog";
import { RulesDialog } from "./components/RulesDialog";
import { StatusBar } from "./components/StatusBar";
import { TeamCard } from "./components/TeamCard";
import { TopBar } from "./components/TopBar";
import { CATEGORIES } from "./data/game";
import { TEAMS, teamName } from "./game/logic";
import type { Team } from "./game/types";
import { useGame } from "./game/useGame";
import styles from "./App.module.css";

const RESULT_DELAY_MS = 900; // let the winning line animate before the dialog opens

export default function App() {
  const [state, dispatch] = useGame();
  const [openCell, setOpenCell] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const teamNameOf = useCallback((team: Team) => teamName(state, team), [state]);

  // Open the result dialog only when a round ends during this session (not after a page refresh).
  const previousResult = useRef(state.result);
  useEffect(() => {
    const wasOver = previousResult.current !== null;
    previousResult.current = state.result;
    if (state.result === null) {
      setShowResult(false);
      return;
    }
    if (wasOver) return;
    const timer = setTimeout(() => setShowResult(true), RESULT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state.result]);

  const openQuestion = (index: number) => {
    if (!state.result && !state.board[index]) setOpenCell(index);
  };

  const placeMark = (team: Team) => {
    if (openCell === null) return;
    dispatch({ type: "place", index: openCell, team });
    setOpenCell(null);
  };

  const skipQuestion = () => {
    dispatch({ type: "skip" });
    setOpenCell(null);
  };

  return (
    <div className={styles.app}>
      <TopBar
        canUndo={state.history.length > 0}
        roundOver={state.result !== null}
        onUndo={() => dispatch({ type: "undo" })}
        onNewGame={() => dispatch({ type: "newGame" })}
        onReset={() => dispatch({ type: "reset" })}
        onRules={() => setShowRules(true)}
      />

      <main className={styles.stage}>
        {TEAMS.map((team) => (
          <div key={team} className={styles.team} data-slot={team}>
            <TeamCard
              team={team}
              name={state.names[team]}
              displayName={teamNameOf(team)}
              score={state.scores[team]}
              active={!state.result && state.turn === team}
              onRename={(name) => dispatch({ type: "rename", team, name })}
            />
          </div>
        ))}

        <div className={styles.center}>
          <Board
            board={state.board}
            result={state.result}
            winLine={state.winLine}
            teamNameOf={teamNameOf}
            onOpen={openQuestion}
          />
          <StatusBar turn={state.turn} result={state.result} teamNameOf={teamNameOf} />
        </div>
      </main>

      <QuestionDialog
        category={openCell === null ? null : CATEGORIES[openCell]}
        turn={state.turn}
        teamNameOf={teamNameOf}
        onPlace={placeMark}
        onSkip={skipQuestion}
        onClose={() => setOpenCell(null)}
      />

      <ResultDialog
        open={showResult}
        result={state.result}
        scores={state.scores}
        teamNameOf={teamNameOf}
        onNewGame={() => dispatch({ type: "newGame" })}
        onClose={() => setShowResult(false)}
      />

      <RulesDialog open={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}
