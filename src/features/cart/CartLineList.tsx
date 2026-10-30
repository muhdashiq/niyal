import { useLayoutEffect, useRef } from 'react';
import { useCart } from './CartProvider';
import { CartLineItem, type CartLineVariant } from './CartLineItem';
import styles from './CartLineList.module.css';
import { lineKey, useCartUi } from './CartUiProvider';

type CartLineListProps = {
  variant: CartLineVariant;
  onNavigate?: () => void;
};

export const CartLineList = ({ variant, onNavigate }: CartLineListProps) => {
  const { lines } = useCart();
  const { isDrawerOpen, takeRequestedLineFocus } = useCartUi();
  const listRef = useRef<HTMLUListElement>(null);
  const isInFront = (variant === 'compact') === isDrawerOpen;

  useLayoutEffect(() => {
    if (!isInFront) return;
    const key = takeRequestedLineFocus();
    if (key) listRef.current?.querySelector<HTMLElement>(`[data-line-focus="${key}"]`)?.focus();
  });

  return (
    <ul ref={listRef} className={styles.list}>
      {lines.map((line) => (
        <li key={lineKey(line.perfumeId, line.size)} className={styles.item}>
          <CartLineItem line={line} variant={variant} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
};
