import type { Team } from "../game/types";
import { Mark } from "./Mark";
import styles from "./TeamCard.module.css";

interface TeamCardProps {
  team: Team;
  name: string;
  displayName: string;
  score: number;
  active: boolean;
  onRename: (name: string) => void;
}

export function TeamCard({ team, name, displayName, score, active, onRename }: TeamCardProps) {
  return (
    <section
      className={styles.card}
      data-team={team}
      data-active={active ? "" : undefined}
      aria-label={displayName}
    >
      <span className={styles.badge}>
        <Mark team={team} />
      </span>

      <input
        className={styles.name}
        value={name}
        maxLength={24}
        aria-label="שם הקבוצה"
        title="לחצו לשינוי שם הקבוצה"
        onChange={(e) => onRename(e.target.value)}
        onBlur={() => onRename(displayName)}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />

      <div className={styles.score}>
        <span className={styles.scoreValue}>{score}</span>
        <span className={styles.scoreLabel}>ניצחונות</span>
      </div>

      <span className={styles.turn} aria-hidden={!active}>
        התור שלכם
      </span>
    </section>
  );
}
