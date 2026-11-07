import { CircleHelp, ListRestart, Maximize2, Minimize2, RotateCcw, Undo2 } from "lucide-react";
import { HEADER } from "../data/game";
import { useFullscreen } from "../hooks/useFullscreen";
import { Menu, type MenuItem } from "./Menu";
import styles from "./TopBar.module.css";

interface TopBarProps {
  canUndo: boolean;
  roundOver: boolean;
  onUndo: () => void;
  onNewGame: () => void;
  onReset: () => void;
  onRules: () => void;
}

export function TopBar({ canUndo, roundOver, onUndo, onNewGame, onReset, onRules }: TopBarProps) {
  const fullscreen = useFullscreen();

  const menuItems: MenuItem[] = [
    { id: "rules", label: "איך משחקים", hint: "החוקים בקצרה", icon: CircleHelp, onSelect: onRules },
    ...(fullscreen.supported
      ? [
          {
            id: "fullscreen",
            label: fullscreen.active ? "יציאה ממסך מלא" : "מסך מלא",
            hint: "מומלץ להקרנה על מסך גדול",
            icon: fullscreen.active ? Minimize2 : Maximize2,
            onSelect: fullscreen.toggle
          }
        ]
      : []),
    {
      id: "reset",
      label: "איפוס ניקוד",
      hint: "מאפס ניצחונות ומתחיל מההתחלה",
      icon: ListRestart,
      onSelect: onReset,
      danger: true,
      confirmLabel: "לחצו שוב לאישור האיפוס",
      separatorBefore: true
    }
  ];

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <div className={styles.badge} aria-hidden="true">
          <span>70</span>
        </div>
        <div className={styles.brandText}>
          <p className={styles.eyebrow}>{HEADER.eyebrow}</p>
          <h1 className={styles.title}>{HEADER.title}</h1>
          <p className={styles.subtitle}>{HEADER.subtitle}</p>
        </div>
      </div>

      <nav className={styles.actions} aria-label="פעולות משחק">
        <button type="button" className={styles.secondary} onClick={onUndo} disabled={!canUndo}>
          <Undo2 aria-hidden="true" />
          <span>ביטול מהלך</span>
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={onNewGame}
          data-attention={roundOver ? "" : undefined}
        >
          <RotateCcw aria-hidden="true" />
          <span>סיבוב חדש</span>
        </button>
      </nav>

      <div className={styles.menu}>
        <Menu items={menuItems} />
      </div>
    </header>
  );
}
