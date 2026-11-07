import { CATEGORIES } from "../data/game";
import type { CellValue, GameResult, Team } from "../game/types";
import { catStyle } from "../styles/color";
import { Mark } from "./Mark";
import styles from "./Board.module.css";

interface BoardProps {
  board: CellValue[];
  result: GameResult;
  winLine: readonly number[] | null;
  teamNameOf: (team: Team) => string;
  onOpen: (index: number) => void;
}

export function Board({ board, result, winLine, teamNameOf, onOpen }: BoardProps) {
  return (
    <div className={styles.board} data-over={result ? "" : undefined}>
      {CATEGORIES.map((category, index) => {
        const value = board[index];
        const Icon = category.icon;
        const isWin = winLine?.includes(index) ?? false;

        return (
          <button
            key={index}
            type="button"
            className={styles.cell}
            style={catStyle(category.hue)}
            data-cell={index}
            data-team={value ?? undefined}
            data-win={isWin ? "" : undefined}
            disabled={Boolean(value || result)}
            onClick={() => onOpen(index)}
            aria-label={value ? `${category.title} – תפוס ע"י ${teamNameOf(value)}` : `${category.title} – פתיחת שאלה`}
          >
            {value ? (
              <>
                <Mark team={value} animated className={styles.mark} />
                <span className={styles.takenLabel}>
                  <Icon size="1em" strokeWidth={2.25} aria-hidden="true" />
                  {category.title}
                </span>
              </>
            ) : (
              <>
                <span className={styles.icon}>
                  <Icon strokeWidth={2} aria-hidden="true" />
                </span>
                <span className={styles.title}>{category.title}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
