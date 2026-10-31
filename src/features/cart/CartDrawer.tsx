import { AnimatePresence, m } from 'motion/react';
import { useId, useRef, useState } from 'react';
import { ButtonLink } from '../../components/Button';
import { CloseIcon } from '../../components/icons';
import { IconButton } from '../../components/IconButton';
import { useLocale } from '../../i18n/LocaleProvider';
import { DESKTOP_QUERY } from '../../lib/breakpoints';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import { useModal } from '../../lib/useModal';
import styles from './CartDrawer.module.css';
import { CartLineList } from './CartLineList';
import { useCart } from './CartProvider';
import { useCartUi } from './CartUiProvider';
import { CartToast } from './CartToast';
import { EmptyBag } from './EmptyBag';
import { OrderTotals } from './OrderTotals';

const TRANSITION = { duration: DURATION.base, ease: EASE_SETTLE };

const DrawerPanel = () => {
  const { lines } = useCart();
  const { dismissDrawer, closeDrawerForNavigation } = useCartUi();
  const { t, isRightToLeft } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // The panel sits at the inline end, which is the left edge in Arabic and Urdu.
  const [hiddenPosition] = useState(() => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return { y: '100%' };
    return { x: isRightToLeft ? '-100%' : '100%' };
  });
  useModal(panelRef, dismissDrawer);

  return (
    <>
      <m.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION}
        onClick={dismissDrawer}
      />
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-surface="light"
        className={styles.panel}
        initial={hiddenPosition}
        animate={{ x: 0, y: 0 }}
        exit={hiddenPosition}
        transition={TRANSITION}
      >
        <div className={styles.heading}>
          <h2 id={titleId} className="text-h3">
            {t.cart.title}
          </h2>
          <IconButton label={t.cart.closeBag} onClick={dismissDrawer}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={styles.body}>
          <div className={styles.lines}>
            {lines.length > 0 ? (
              <CartLineList variant="compact" onNavigate={closeDrawerForNavigation} />
            ) : (
              <EmptyBag onNavigate={closeDrawerForNavigation} />
            )}
          </div>
          <CartToast placement="drawer" />
        </div>

        {lines.length > 0 && (
          <div className={styles.footer}>
            <OrderTotals />
            <div className={styles.actions}>
              <ButtonLink to="/cart" variant="ghost" onClick={closeDrawerForNavigation}>
                {t.cart.viewBag}
              </ButtonLink>
              <ButtonLink to="/checkout" onClick={closeDrawerForNavigation}>
                {t.cart.checkout}
              </ButtonLink>
            </div>
          </div>
        )}
      </m.div>
    </>
  );
};

export const CartDrawer = () => {
  const { isDrawerOpen } = useCartUi();

  return <AnimatePresence>{isDrawerOpen && <DrawerPanel />}</AnimatePresence>;
};
