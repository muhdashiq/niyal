import { AnimatePresence, m } from 'motion/react';
import { createPortal } from 'react-dom';
import { AnimatedPrice } from '../../components/AnimatedPrice';
import { Button } from '../../components/Button';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import type { BottleSize } from '../../types';
import { AddToBagLabel } from './AddToBagLabel';
import styles from './StickyAddBar.module.css';

type StickyAddBarProps = {
  isVisible: boolean;
  name: string;
  size: BottleSize;
  total: number;
  isAdded: boolean;
  onAdd: () => void;
};

// Keeps Add to bag under the thumb on phones once the main button has scrolled away.
// Hidden by CSS from 900 px up, where the details column has room to keep it close.
export const StickyAddBar = ({ isVisible, name, size, total, isAdded, onAdd }: StickyAddBarProps) =>
  createPortal(
    <AnimatePresence>
      {isVisible && (
        <m.div
          role="region"
          aria-label="Quick add to bag"
          data-surface="dark"
          className={styles.bar}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: DURATION.base, ease: EASE_SETTLE }}
        >
          <div className={styles.summary}>
            <p className={styles.name}>
              {name}, {size} ml
            </p>
            <AnimatedPrice amount={total} />
          </div>
          <Button size="compact" onClick={onAdd}>
            <AddToBagLabel isAdded={isAdded} />
          </Button>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
