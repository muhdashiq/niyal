import { useState } from 'react';
import { Button } from '../../components/Button';
import { CartButton } from '../cart/CartButton';
import styles from './Styleguide.module.css';

export const CartBadgeSection = () => {
  const [count, setCount] = useState(0);

  return (
    <section data-surface="dark" className={styles.band} aria-labelledby="badge-heading">
      <h2 id="badge-heading" className={styles.sectionHeading}>
        Cart badge
      </h2>
      <div className={styles.row}>
        <CartButton count={count} />
        <Button variant="ghost" onClick={() => setCount(count + 1)}>
          Add one
        </Button>
        <Button variant="ghost" disabled={count === 0} onClick={() => setCount(count - 1)}>
          Remove one
        </Button>
      </div>
    </section>
  );
};
