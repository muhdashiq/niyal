import { AnimatePresence, m } from 'motion/react';
import type { ComponentProps } from 'react';
import { DURATION, EASE_SETTLE } from '../lib/motion';
import styles from './AnimatedPrice.module.css';
import { Price } from './Price';

const TRANSITION = { duration: DURATION.base, ease: EASE_SETTLE };

// The old figure slides up and out as the new one comes in beneath it.
export const AnimatedPrice = ({ amount, size }: ComponentProps<typeof Price>) => (
  <span className={styles.frame}>
    <AnimatePresence initial={false} mode="popLayout">
      <m.span
        key={amount}
        className={styles.figure}
        initial={{ opacity: 0, y: '0.5em' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '-0.5em' }}
        transition={TRANSITION}
      >
        <Price amount={amount} size={size} />
      </m.span>
    </AnimatePresence>
  </span>
);
