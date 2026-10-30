import { useLayoutEffect, useRef } from 'react';
import { AmbientLight } from '../../components/AmbientLight';
import { Button, ButtonAnchor } from '../../components/Button';
import { ShelfBottle } from '../../components/ShelfBottle';
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
            Your order is ready to send on WhatsApp
          </h1>
          <p className="text-lead text-muted">Tap send in WhatsApp to confirm.</p>
          <p className={styles.reference}>
            <span className="text-small text-muted">Order ref</span>
            <span className={styles.referenceValue}>{order.orderRef}</span>
          </p>
          <div className={styles.actions}>
            <ButtonAnchor href={whatsappUrl(order.message)} target="_blank" rel="noopener noreferrer">
              Open WhatsApp again
            </ButtonAnchor>
            <Button variant="ghost" onClick={onFinish}>
              Clear bag &amp; continue shopping
            </Button>
          </div>
          <Button variant="text" onClick={onEditDetails}>
            Change my details
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
