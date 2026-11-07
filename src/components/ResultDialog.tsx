import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Handshake, RotateCcw } from "lucide-react";
import { TEAMS } from "../game/logic";
import type { GameResult, Team } from "../game/types";
import { Mark } from "./Mark";
import { Modal } from "./Modal";
import styles from "./Dialog.module.css";

// canvas-confetti only accepts hex; these follow the board's nine hues.
const CONFETTI_COLORS = [
  "#f47c6b", "#f5a04a", "#e8c13a", "#6cc46a", "#3fc1b0",
  "#4aa8ef", "#6d86f2", "#b07ef0", "#ee6fb5"
];

interface ResultDialogProps {
  open: boolean;
  result: GameResult;
  scores: Record<Team, number>;
  teamNameOf: (team: Team) => string;
  onNewGame: () => void;
  onClose: () => void;
}

export function ResultDialog({ open, result, scores, teamNameOf, onNewGame, onClose }: ResultDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const winner = result === "X" || result === "O" ? result : null;

  // Confetti is drawn on a canvas inside the dialog so it renders above the top-layer backdrop.
  useEffect(() => {
    if (!open || !winner || !canvasRef.current) return;
    const fire = confetti.create(canvasRef.current, { resize: true, disableForReducedMotion: true });
    const shot = (x: number, angle: number) =>
      fire({ particleCount: 90, spread: 70, startVelocity: 55, angle, origin: { x, y: 0.75 }, colors: CONFETTI_COLORS });
    shot(0.15, 60);
    shot(0.85, 120);
    const second = setTimeout(() => fire({ particleCount: 140, spread: 120, origin: { y: 0.4 }, colors: CONFETTI_COLORS }), 450);
    return () => {
      clearTimeout(second);
      fire.reset();
    };
  }, [open, winner]);

  return (
    <Modal open={open && result !== null} onClose={onClose} labelledBy="result-title">
      <canvas ref={canvasRef} className={styles.confetti} aria-hidden="true" />
      <div className={`${styles.panel} ${styles.resultPanel}`} data-team={winner ?? undefined}>
        <div className={styles.resultBadge}>
          {winner ? <Mark team={winner} animated /> : <Handshake strokeWidth={1.75} />}
        </div>

        <h2 id="result-title" className={styles.resultTitle}>
          {winner ? `${teamNameOf(winner)} ניצחו!` : "תיקו!"}
        </h2>
        <p className={styles.resultText}>
          {winner ? "מזל טוב לרוני ליום הולדת 70 🎂" : "שתי הקבוצות מכירות את רוני מצוין"}
        </p>

        <div className={styles.scoreline}>
          {TEAMS.map((team) => (
            <div key={team} className={styles.scoreChip} data-team={team}>
              <Mark team={team} className={styles.scoreChipMark} />
              <span className={styles.scoreChipName}>{teamNameOf(team)}</span>
              <strong>{scores[team]}</strong>
            </div>
          ))}
        </div>

        <div className={styles.resultActions}>
          <button type="button" className={styles.primary} onClick={onNewGame} data-autofocus>
            <RotateCcw size={18} aria-hidden="true" />
            סיבוב חדש
          </button>
          <button type="button" className={styles.secondary} onClick={onClose}>
            חזרה ללוח
          </button>
        </div>
      </div>
    </Modal>
  );
}
