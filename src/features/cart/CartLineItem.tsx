import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedPrice } from '../../components/AnimatedPrice';
import { BottleArt } from '../../components/BottleArt';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import { Select } from '../../components/Select';
import { BOTTLE_SIZES } from '../../data/perfumes';
import { formatCurrency } from '../../lib/formatCurrency';
import styles from './CartLineItem.module.css';
import { useCart } from './CartProvider';
import type { PricedLine } from './cartTotals';
import { lineKey, useCartUi } from './CartUiProvider';

export type CartLineVariant = 'compact' | 'roomy';

type CartLineItemProps = {
  line: PricedLine;
  variant: CartLineVariant;
  onNavigate?: () => void;
};

const focusUndoButton = () => {
  document.querySelector<HTMLElement>('[data-undo-button]')?.focus();
};

export const CartLineItem = ({ line, variant, onNavigate }: CartLineItemProps) => {
  const { setQuantity } = useCart();
  const { removeLine, changeLineSize } = useCartUi();
  const { perfume, perfumeId, size, quantity, unitPrice, lineTotal } = line;

  const handleSizeChange = (value: string) => {
    const newSize = BOTTLE_SIZES.find((candidate) => String(candidate) === value);
    if (newSize) changeLineSize(line, newSize);
  };

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    const usedKeyboard = event.currentTarget.matches(':focus-visible');
    removeLine(line);
    if (usedKeyboard) requestAnimationFrame(focusUndoButton);
  };

  return (
    <article className={`${styles.line} ${styles[variant]}`}>
      <div className={styles.thumbnail}>
        <BottleArt perfume={perfume} size={size} decorative />
      </div>

      <div className={styles.details}>
        <div className={styles.heading}>
          <h3 className={styles.name}>
            <Link to={`/perfume/${perfumeId}`} className={styles.nameLink} onClick={onNavigate}>
              {perfume.name}
            </Link>
          </h3>
          <div className={styles.lineTotal}>
            <AnimatedPrice amount={lineTotal} />
          </div>
        </div>

        {variant === 'roomy' && <p className="text-muted">{perfume.tagline}</p>}

        <div className={styles.controls}>
          <Select
            aria-label={`Size of ${perfume.name}`}
            data-line-focus={lineKey(perfumeId, size)}
            value={size}
            onChange={(event) => handleSizeChange(event.target.value)}
          >
            {BOTTLE_SIZES.map((option) => (
              <option key={option} value={option}>
                {option} ml
              </option>
            ))}
          </Select>
          <QuantityStepper
            label={`Quantity of ${perfume.name}, ${size} ml`}
            value={quantity}
            announceChanges={false}
            onChange={(nextQuantity) => setQuantity(perfumeId, size, nextQuantity)}
          />
        </div>

        <div className={styles.footer}>
          <p className="text-small text-muted">{formatCurrency(unitPrice)} each</p>
          <Button
            variant="text"
            aria-label={`Remove ${perfume.name}, ${size} ml`}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
};
