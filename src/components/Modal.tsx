import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
}

/** Ignore backdrop clicks right after opening (e.g. a double-click on a board cell). */
const BACKDROP_GUARD_MS = 400;

/**
 * Thin wrapper over native <dialog>: focus trap, Esc and top-layer for free.
 * Put `data-autofocus` on the element that should receive focus when it opens.
 */
export function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const openedAt = useRef(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      openedAt.current = Date.now();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // The browser may close the dialog on its own (Esc twice, Android back button) – keep state in sync.
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        if (Date.now() - openedAt.current < BACKDROP_GUARD_MS) return;
        onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}
