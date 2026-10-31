import { useId, useState } from 'react';
import { BottleArt } from '../../components/BottleArt';
import { ButtonLink } from '../../components/Button';
import { ChevronDownIcon } from '../../components/icons';
import { Price } from '../../components/Price';
import { useLocale } from '../../i18n/LocaleProvider';
import { useCart } from '../cart/CartProvider';
import { OrderTotals } from '../cart/OrderTotals';
import styles from './CheckoutSummary.module.css';

// Collapsed behind a button on phones, so the form comes first. Always open on desktop.
export const CheckoutSummary = () => {
  const { lines, total } = useCart();
  const { t, formatSize } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <aside className={styles.summary} aria-label={t.cart.summary}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.toggleLabel}>{t.cart.summary}</span>
        <span className={styles.toggleEnd}>
          <Price amount={total} />
          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
            <ChevronDownIcon />
          </span>
        </span>
      </button>

      <h2 className={`text-h3 ${styles.heading}`}>{t.cart.summary}</h2>

      <div id={panelId} className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <ul className={styles.lines}>
          {lines.map((line) => (
            <li key={`${line.perfumeId}-${line.size}`} className={styles.line}>
              <div className={styles.thumbnail}>
                <BottleArt perfume={line.perfume} size={line.size} decorative />
              </div>
              <div>
                <p className={styles.name}>{line.perfume.name}</p>
                <p className="text-small text-muted">
                  {formatSize(line.size)} × {line.quantity}
                </p>
              </div>
              <Price amount={line.lineTotal} size="small" />
            </li>
          ))}
        </ul>
        <OrderTotals />
        <ButtonLink to="/cart" variant="text">
          {t.checkout.editBag}
        </ButtonLink>
      </div>
    </aside>
  );
};
