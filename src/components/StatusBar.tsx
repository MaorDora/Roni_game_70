import type { GameResult, Team } from "../game/types";
import styles from "./StatusBar.module.css";

interface StatusBarProps {
  turn: Team;
  result: GameResult;
  teamNameOf: (team: Team) => string;
}

export function StatusBar({ turn, result, teamNameOf }: StatusBarProps) {
  const team = result === "draw" ? undefined : (result ?? turn);

  return (
    <p className={styles.status} data-team={team} aria-live="polite">
      <span className={styles.dot} aria-hidden="true" />
      {result === "draw" && "תיקו! אפשר להתחיל סיבוב חדש"}
      {(result === "X" || result === "O") && (
        <>
          <strong>{teamNameOf(result)}</strong>&nbsp;ניצחו בסיבוב הזה
        </>
      )}
      {result === null && (
        <>
          התור של&nbsp;<strong>{teamNameOf(turn)}</strong>&nbsp;– בחרו ריבוע
        </>
      )}
    </p>
  );
}
