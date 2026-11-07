import { X } from "lucide-react";
import { Modal } from "./Modal";
import styles from "./Dialog.module.css";

const RULES = [
  "מתחלקים לשתי קבוצות: איקס ועיגול. אפשר לשנות את שמות הקבוצות בלחיצה על השם.",
  "הקבוצה שבתור בוחרת ריבוע ושומעת שאלה על רוני.",
  "ענו נכון? לוחצים על הקבוצה, והסימן שלה נכנס לריבוע.",
  "אף אחד לא צדק? הריבוע נשאר פתוח והתור עובר.",
  "שלושה סימנים בשורה, בטור או באלכסון – ניצחון!"
];

export function RulesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="rules-title">
      <div className={`${styles.panel} ${styles.rulesPanel}`}>
        <header className={styles.plainHead}>
          <h2 id="rules-title">איך משחקים?</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="סגירה">
            <X size={20} />
          </button>
        </header>
        <ol className={styles.rules}>
          {RULES.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
