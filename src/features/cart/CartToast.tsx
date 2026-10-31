import { AnimatePresence, m } from 'motion/react';
import { Button } from '../../components/Button';
import { MAX_QUANTITY } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
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
  const { t, formatSize } = useLocale();

  return (
    <div className={`${styles.region} ${styles[placement]}`}>
      <AnimatePresence>
        {toast && (
          <m.div
            role="region"
            aria-label={t.cart.messageRegion}
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
                  {t.cart.removed(t.common.lineName(toast.name, formatSize(toast.line.size)))}
                </p>
                <Button data-undo-button variant="text" onClick={undoRemoval}>
                  {t.cart.undo}
                </Button>
              </>
            ) : (
              <p className={`text-small ${styles.notice}`}>{t.cart.limit(MAX_QUANTITY)}</p>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
