import { Button } from '../../components/Button';
import { Price } from '../../components/Price';
import { QuantityStepper } from '../../components/QuantityStepper';
import { BOTTLE_SIZES, PERFUMES } from '../../data/perfumes';
import { useCart } from '../cart/CartProvider';
import styles from './Styleguide.module.css';

// A plain view of the cart state, so it can be tried out before the cart screens exist.
export const CartStateSection = () => {
  const { lines, itemCount, subtotal, shipping, total, add, remove, setQuantity, changeSize, clear } =
    useCart();
  const firstPerfume = PERFUMES[0];

  return (
    <section data-surface="light" className={styles.band} aria-labelledby="cart-state-heading">
      <h2 id="cart-state-heading" className={styles.sectionHeading}>
        Cart state
      </h2>
      <div className={styles.row}>
        {firstPerfume && (
          <Button variant="ghost" onClick={() => add(firstPerfume.id, 50)}>
            Add {firstPerfume.name}
          </Button>
        )}
        <Button variant="ghost" disabled={lines.length === 0} onClick={clear}>
          Clear
        </Button>
      </div>
      <ul className={styles.cartLines}>
        {lines.map((line) => (
          <li key={`${line.perfumeId}-${line.size}`} className={styles.row}>
            <span>{line.perfume.name}</span>
            <select
              aria-label={`Size of ${line.perfume.name}`}
              value={line.size}
              onChange={(event) => {
                const newSize = BOTTLE_SIZES.find((size) => String(size) === event.target.value);
                if (newSize) changeSize(line.perfumeId, line.size, newSize);
              }}
            >
              {BOTTLE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} ml
                </option>
              ))}
            </select>
            <QuantityStepper
              value={line.quantity}
              onChange={(quantity) => setQuantity(line.perfumeId, line.size, quantity)}
            />
            <Price amount={line.lineTotal} />
            <Button variant="text" onClick={() => remove(line.perfumeId, line.size)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <p data-testid="cart-totals">
        {itemCount} items, subtotal <Price amount={subtotal} />, shipping <Price amount={shipping} />,
        total <Price amount={total} />
      </p>
    </section>
  );
};
