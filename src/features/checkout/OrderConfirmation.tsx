import { useLayoutEffect, useRef } from 'react';
import { AmbientLight } from '../../components/AmbientLight';
import { Button, ButtonAnchor } from '../../components/Button';
import { ShelfBottle } from '../../components/ShelfBottle';
import { useLocale } from '../../i18n/LocaleProvider';
import { whatsappUrl } from '../../lib/whatsappUrl';
import { useCart } from '../cart/CartProvider';
import type { PlacedOrder } from './checkoutStorage';
import styles from './OrderConfirmation.module.css';

type OrderConfirmationProps = {
  order: PlacedOrder;
  onEditDetails: () => void;
  onFinish: () => void;
};

export const OrderConfirmation = ({ order, onEditDetails, onFinish }: OrderConfirmationProps) => {
  const { lines } = useCart();
  const { t } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstLine = lines[0];

  // The form the customer was just using has gone, so their focus and scroll position go here.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, []);

  return (
    <div data-surface="dark" className={styles.confirmation}>
      <AmbientLight accent={firstLine?.perfume.accent} placement="right" />
      <div className={`page-width ${styles.layout}`}>
        <div className={styles.copy}>
          <h1 ref={headingRef} tabIndex={-1} className={styles.heading}>
            {t.checkout.confirmTitle}
          </h1>
          <p className="text-lead text-muted">{t.checkout.confirmBody}</p>
          <p className={styles.reference}>
            <span className="text-small text-muted">{t.checkout.orderRef}</span>
            <span dir="ltr" className={styles.referenceValue}>
              {order.orderRef}
            </span>
          </p>
          <div className={styles.actions}>
            <ButtonAnchor href={whatsappUrl(order.message)} target="_blank" rel="noopener noreferrer">
              {t.checkout.openAgain}
            </ButtonAnchor>
            <Button variant="ghost" onClick={onFinish}>
              {t.checkout.clearAndContinue}
            </Button>
          </div>
          <Button variant="text" onClick={onEditDetails}>
            {t.checkout.changeDetails}
          </Button>
        </div>

        {firstLine && (
          <div className={styles.shelf}>
            <div className={styles.bottle}>
              <ShelfBottle perfume={firstLine.perfume} size={firstLine.size} decorative />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
