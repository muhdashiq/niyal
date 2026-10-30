import { AnimatedPrice } from '../../components/AnimatedPrice';
import { FREE_SHIPPING_THRESHOLD } from '../../config';
import { formatCurrency } from '../../lib/formatCurrency';
import { useCart } from './CartProvider';
import styles from './OrderTotals.module.css';

export const OrderTotals = () => {
  const { subtotal, shipping, total } = useCart();
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  return (
    <div className={styles.totals}>
      <div className={styles.freeShipping}>
        <p className="text-small text-muted">
          {amountToFreeShipping > 0
            ? `Free shipping from ${formatCurrency(FREE_SHIPPING_THRESHOLD)}. ${formatCurrency(amountToFreeShipping)} to go.`
            : 'Your order ships free.'}
        </p>
        <div aria-hidden="true" className={styles.track}>
          <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className="text-muted">Subtotal</dt>
          <dd>
            <AnimatedPrice amount={subtotal} />
          </dd>
        </div>
        <div className={styles.row}>
          <dt className="text-muted">Shipping estimate</dt>
          <dd>{shipping === 0 ? 'Free' : <AnimatedPrice amount={shipping} />}</dd>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <dt>Total</dt>
          <dd>
            <AnimatedPrice amount={total} size="large" />
          </dd>
        </div>
      </dl>
    </div>
  );
};
