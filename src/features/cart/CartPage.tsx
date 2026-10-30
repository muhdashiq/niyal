import { ButtonLink } from '../../components/Button';
import { usePageMeta } from '../../lib/usePageMeta';
import styles from './CartPage.module.css';
import { CartLineList } from './CartLineList';
import { useCart } from './CartProvider';
import { describeItemCount } from './cartTotals';
import { EmptyBag } from './EmptyBag';
import { OrderTotals } from './OrderTotals';

export const CartPage = () => {
  const { lines, itemCount } = useCart();
  usePageMeta({
    title: 'Your bag',
    description: 'Review the perfumes in your bag, change sizes and quantities, and go on to checkout.',
  });

  return (
    <div className={`page-width ${styles.page}`}>
      <header className={styles.intro}>
        <h1>Your bag</h1>
        {lines.length > 0 && <p className="text-lead text-muted">{describeItemCount(itemCount)}</p>}
      </header>

      {lines.length > 0 ? (
        <div className={styles.layout}>
          <section aria-labelledby="bag-lines-heading">
            <h2 id="bag-lines-heading" className="visually-hidden">
              Items in your bag
            </h2>
            <CartLineList variant="roomy" />
          </section>

          <aside className={styles.summary} aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-h3">
              Order summary
            </h2>
            <OrderTotals />
            <div className={styles.actions}>
              <ButtonLink to="/checkout">Checkout</ButtonLink>
              <ButtonLink to="/collection" variant="text">
                Continue shopping
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
