import { useState } from "react";
import { Eye, X } from "lucide-react";
import type { Category } from "../data/game";
import { TEAMS } from "../game/logic";
import type { Team } from "../game/types";
import { catStyle } from "../styles/color";
import { Mark } from "./Mark";
import { Modal } from "./Modal";
import styles from "./Dialog.module.css";

interface QuestionDialogProps {
  category: Category | null;
  turn: Team;
  teamNameOf: (team: Team) => string;
  onPlace: (team: Team) => void;
  onSkip: () => void;
  onClose: () => void;
}

export function QuestionDialog({ category, onClose, ...rest }: QuestionDialogProps) {
  return (
    <Modal open={category !== null} onClose={onClose} labelledBy="question-title">
      {/* keyed so "reveal" resets for every question */}
      {category && <QuestionPanel key={category.title} category={category} onClose={onClose} {...rest} />}
    </Modal>
  );
}

function QuestionPanel({
  category,
  turn,
  teamNameOf,
  onPlace,
  onSkip,
  onClose
}: QuestionDialogProps & { category: Category }) {
  const [revealed, setRevealed] = useState(false);
  const Icon = category.icon;
  const answers = category.answer.length ? category.answer : ["התשובה אצל רוני 😉"];

  return (
    <div className={styles.panel} style={catStyle(category.hue)}>
      <header className={styles.catHead}>
        <span className={styles.catIcon}>
          <Icon aria-hidden="true" />
        </span>
        <span className={styles.catTitle}>{category.title}</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="סגירה">
          <X size={20} />
        </button>
      </header>

      <div className={styles.body}>
        <h2 id="question-title" className={styles.question}>
          {category.question}
        </h2>

        {revealed ? (
          <div className={styles.answer}>
            <span className={styles.answerLabel}>התשובה</span>
            <ul className={answers.length > 1 ? styles.answerList : styles.answerSingle}>
              {answers.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ) : (
          <button type="button" className={styles.reveal} onClick={() => setRevealed(true)} data-autofocus>
            <Eye size={20} aria-hidden="true" />
            הצגת התשובה
          </button>
        )}
      </div>

      <footer className={styles.foot}>
        <p className={styles.ask}>מי ענה נכון?</p>
        <div className={styles.teamButtons}>
          {TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              className={styles.teamButton}
              data-team={team}
              onClick={() => onPlace(team)}
            >
              <Mark team={team} className={styles.teamButtonMark} />
              <span>{teamNameOf(team)}</span>
              {team === turn && <span className={styles.turnTag}>בתור</span>}
            </button>
          ))}
        </div>
        <button type="button" className={styles.skip} onClick={onSkip}>
          אף אחד לא צדק · התור עובר
        </button>
      </footer>
    </div>
  );
}
