import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Menu as MenuIcon, type LucideIcon } from "lucide-react";
import styles from "./Menu.module.css";

export interface MenuItem {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  onSelect: () => void;
  danger?: boolean;
  /** When set, the first click arms the item and shows this text; the second click runs it. */
  confirmLabel?: string;
  separatorBefore?: boolean;
}

const CONFIRM_TIMEOUT_MS = 4000;

export function Menu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    setArmed(null);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Outside click / Esc close the menu; focus the first item on open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    listRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(null), CONFIRM_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [armed]);

  const select = (item: MenuItem) => {
    if (item.confirmLabel && armed !== item.id) {
      setArmed(item.id);
      return;
    }
    close(true);
    item.onSelect();
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const entries = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const current = entries.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => entries[(i + entries.length) % entries.length]?.focus();

    if (e.key === "ArrowDown") focusAt(current + 1);
    else if (e.key === "ArrowUp") focusAt(current - 1);
    else if (e.key === "Home") focusAt(0);
    else if (e.key === "End") focusAt(entries.length - 1);
    else if (e.key === "Tab") return close(false);
    else return;
    e.preventDefault();
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-open={open ? "" : undefined}
        onClick={() => (open ? close(false) : setOpen(true))}
      >
        <MenuIcon aria-hidden="true" />
        <span className={styles.triggerLabel}>תפריט</span>
        <ChevronDown className={styles.chevron} aria-hidden="true" />
      </button>

      {open && (
        <div ref={listRef} id={menuId} role="menu" aria-label="תפריט" className={styles.menu} onKeyDown={onListKeyDown}>
          {items.map((item) => {
            const Icon = item.icon;
            const isArmed = armed === item.id;
            return (
              <div key={item.id} role="none">
                {item.separatorBefore && <div role="separator" className={styles.separator} />}
                <button
                  type="button"
                  role="menuitem"
                  className={styles.item}
                  data-danger={item.danger ? "" : undefined}
                  data-armed={isArmed ? "" : undefined}
                  onClick={() => select(item)}
                >
                  <span className={styles.itemIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.itemText}>
                    <span className={styles.itemLabel}>{isArmed ? item.confirmLabel : item.label}</span>
                    <span className={styles.itemHint}>{isArmed ? "הפעולה תתבצע בלחיצה נוספת" : item.hint}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
