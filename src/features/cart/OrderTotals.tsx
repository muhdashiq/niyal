import { AnimatedPrice } from '../../components/AnimatedPrice';
import { FREE_SHIPPING_THRESHOLD, HOME_CURRENCY } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import { useCart } from './CartProvider';
import styles from './OrderTotals.module.css';

const HomeShippingProgress = () => {
  const { rupeeSubtotal } = useCart();
  const { t, price, formatPrice } = useLocale();
  const rupeesToFreeShipping = FREE_SHIPPING_THRESHOLD - rupeeSubtotal;
  const progress = Math.min(1, rupeeSubtotal / FREE_SHIPPING_THRESHOLD);

  return (
    <div className={styles.freeShipping}>
      <p className="text-small text-muted">
        {rupeesToFreeShipping > 0
          ? t.totals.freeShippingFrom(
              formatPrice(price(FREE_SHIPPING_THRESHOLD)),
              formatPrice(price(rupeesToFreeShipping)),
            )
          : t.totals.shipsFree}
      </p>
      <div aria-hidden="true" className={styles.track}>
        <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
};

export const OrderTotals = () => {
  const { subtotal, shipping, total } = useCart();
  const { t, currency, country, nameOfCountry } = useLocale();
  const isCourier = shipping.kind === 'courier';

  return (
    <div className={styles.totals}>
      {isCourier ? (
        <p className="text-small text-muted">{t.totals.courierNote(nameOfCountry(country))}</p>
      ) : (
        <HomeShippingProgress />
      )}

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className="text-muted">{t.totals.subtotal}</dt>
          <dd>
            <AnimatedPrice amount={subtotal} />
          </dd>
        </div>
        <div className={styles.row}>
          <dt className="text-muted">{isCourier ? t.totals.courier : t.totals.shippingEstimate}</dt>
          <dd>
            {shipping.kind === 'flat' ? (
              <AnimatedPrice amount={shipping.fee} />
            ) : isCourier ? (
              t.totals.courierCharges
            ) : (
              t.totals.free
            )}
          </dd>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <dt>{isCourier ? t.totals.totalBeforeCourier : t.totals.total}</dt>
          <dd>
            <AnimatedPrice amount={total} size="large" />
          </dd>
        </div>
      </dl>

      {currency !== HOME_CURRENCY && <p className="text-small text-muted">{t.preferences.rateNote}</p>}
    </div>
  );
};
