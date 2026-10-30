import { useReducedMotion } from 'motion/react';
import { type RefObject, useEffect, useRef } from 'react';
import { IconButton } from '../../components/IconButton';
import { BagIcon } from '../../components/icons';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import styles from './CartButton.module.css';
import { describeItemCount } from './cartTotals';
import { useCartUi } from './CartUiProvider';

type CartButtonProps = {
  count: number;
};

const MAX_DISPLAYED_COUNT = 99;

const describeBag = (count: number) => (count === 0 ? 'Bag, empty' : `Bag, ${describeItemCount(count)}`);

const usePulseOnChange = (elementRef: RefObject<HTMLElement>, value: number) => {
  const previousValue = useRef(value);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (previousValue.current === value) return;
    previousValue.current = value;
    if (prefersReducedMotion || !elementRef.current) return;
    elementRef.current.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
      { duration: DURATION.slow * 1000, easing: `cubic-bezier(${EASE_SETTLE.join(', ')})` },
    );
  }, [elementRef, value, prefersReducedMotion]);
};

export const CartButton = ({ count }: CartButtonProps) => {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const { openDrawer } = useCartUi();
  usePulseOnChange(badgeRef, count);

  return (
    <IconButton label={describeBag(count)} aria-haspopup="dialog" onClick={openDrawer}>
      <BagIcon />
      {count > 0 && (
        <span ref={badgeRef} className={styles.badge}>
          {count > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : count}
        </span>
      )}
    </IconButton>
  );
};
