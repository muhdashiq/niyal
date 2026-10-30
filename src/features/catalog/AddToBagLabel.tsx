import { AnimatePresence, m } from 'motion/react';
import { CheckIcon } from '../../components/icons';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import styles from './AddToBagLabel.module.css';

type AddToBagLabelProps = {
  isAdded: boolean;
};

const TRANSITION = { duration: DURATION.fast, ease: EASE_SETTLE };

export const AddToBagLabel = ({ isAdded }: AddToBagLabelProps) => (
  <AnimatePresence initial={false} mode="wait">
    <m.span
      key={isAdded ? 'added' : 'ready'}
      className={styles.label}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={TRANSITION}
    >
      {isAdded ? (
        <>
          Added
          <CheckIcon />
        </>
      ) : (
        'Add to bag'
      )}
    </m.span>
  </AnimatePresence>
);
