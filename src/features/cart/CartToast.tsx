import { AnimatePresence, m } from 'motion/react';
import { Button } from '../../components/Button';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import styles from './CartToast.module.css';
import { useCartUi } from './CartUiProvider';

type CartToastProps = {
  placement: 'drawer' | 'page';
};

// Hovering or keyboard-focusing the toast holds the timer, so nobody loses the chance to undo.
// CartAnnouncer reads these messages out, so this stays silent for screen readers.
export const CartToast = ({ placement }: CartToastProps) => {
  const { toast, undoRemoval, pauseToastTimer, resumeToastTimer } = useCartUi();

  return (
    <div className={`${styles.region} ${styles[placement]}`}>
      <AnimatePresence>
        {toast && (
          <m.div
            role="region"
            aria-label="Bag message"
            data-surface="dark"
            className={styles.toast}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_SETTLE }}
            onMouseEnter={pauseToastTimer}
            onMouseLeave={resumeToastTimer}
            onFocus={(event) => {
              if (event.target.matches(':focus-visible')) pauseToastTimer();
            }}
            onBlur={resumeToastTimer}
          >
            {toast.kind === 'removed' ? (
              <>
                <p className="text-small">
                  Removed {toast.name}, {toast.line.size} ml
                </p>
                <Button data-undo-button variant="text" onClick={undoRemoval}>
                  Undo
                </Button>
              </>
            ) : (
              <p className={`text-small ${styles.notice}`}>{toast.message}</p>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
