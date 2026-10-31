import { ButtonLink } from '../../components/Button';
import { useLocale } from '../../i18n/LocaleProvider';
import { usePageMeta } from '../../lib/usePageMeta';
import styles from './CartPage.module.css';
import { CartLineList } from './CartLineList';
import { useCart } from './CartProvider';
import { EmptyBag } from './EmptyBag';
import { OrderTotals } from './OrderTotals';

export const CartPage = () => {
  const { lines, itemCount } = useCart();
  const { t } = useLocale();
  usePageMeta({ title: t.cart.title, description: t.cart.description });

  return (
    <div className={`page-width ${styles.page}`}>
      <header className={styles.intro}>
        <h1>{t.cart.title}</h1>
        {lines.length > 0 && <p className="text-lead text-muted">{t.cart.itemCount(itemCount)}</p>}
      </header>

      {lines.length > 0 ? (
        <div className={styles.layout}>
          <section aria-labelledby="bag-lines-heading">
            <h2 id="bag-lines-heading" className="visually-hidden">
              {t.cart.itemsHeading}
            </h2>
            <CartLineList variant="roomy" />
          </section>

          <aside className={styles.summary} aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-h3">
              {t.cart.summary}
            </h2>
            <OrderTotals />
            <div className={styles.actions}>
              <ButtonLink to="/checkout">{t.cart.checkout}</ButtonLink>
              <ButtonLink to="/collection" variant="text">
                {t.cart.continueShopping}
              </ButtonLink>
            </div>
          </aside>
        </div>
      ) : (
        <EmptyBag />
      )}
    </div>
  );
};
