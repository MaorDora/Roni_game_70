import type { Team } from "../game/types";
import styles from "./Mark.module.css";

interface MarkProps {
  team: Team;
  /** Draw the stroke in on mount. */
  animated?: boolean;
  className?: string;
}

/** ✕ / ◯ drawn as SVG, coloured with `currentColor`. */
export function Mark({ team, animated = false, className = "" }: MarkProps) {
  const cls = `${styles.mark} ${animated ? styles.animated : ""} ${className}`;

  return team === "X" ? (
    <svg viewBox="0 0 100 100" className={cls} aria-hidden="true">
      <line x1="26" y1="26" x2="74" y2="74" pathLength={100} />
      <line x1="74" y1="26" x2="26" y2="74" pathLength={100} />
    </svg>
  ) : (
    <svg viewBox="0 0 100 100" className={cls} aria-hidden="true">
      <circle cx="50" cy="50" r="27" pathLength={100} transform="rotate(-90 50 50)" />
    </svg>
  );
}
