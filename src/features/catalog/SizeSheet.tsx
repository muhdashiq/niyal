import { AnimatePresence, m } from 'motion/react';
import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button';
import { CloseIcon } from '../../components/icons';
import { IconButton } from '../../components/IconButton';
import { SizeSelector } from '../../components/SizeSelector';
import { DEFAULT_BOTTLE_SIZE } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import { useModal } from '../../lib/useModal';
import type { BottleSize, Perfume } from '../../types';
import styles from './SizeSheet.module.css';

type SheetProps = {
  perfume: Perfume;
  onDismiss: () => void;
  onAdd: (size: BottleSize) => void;
};

type SizeSheetProps = SheetProps & {
  isOpen: boolean;
};

const TRANSITION = { duration: DURATION.base, ease: EASE_SETTLE };

const Sheet = ({ perfume, onDismiss, onAdd }: SheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [size, setSize] = useState<BottleSize>(DEFAULT_BOTTLE_SIZE);
  const { t } = useLocale();
  useModal(sheetRef, onDismiss);

  return (
    <>
      <m.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION}
        onClick={onDismiss}
      />
      <m.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-surface="light"
        className={styles.sheet}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={TRANSITION}
      >
        <div className={styles.heading}>
          <h2 id={titleId} className="text-h3">
            {perfume.name}
          </h2>
          <IconButton label={t.common.close} onClick={onDismiss}>
            <CloseIcon />
          </IconButton>
        </div>
        <SizeSelector perfume={perfume} value={size} onChange={setSize} />
        <div className={styles.action}>
          <Button onClick={() => onAdd(size)}>{t.common.addToBag}</Button>
        </div>
      </m.div>
    </>
  );
};

// Rendered on the body so a card inside a scrolling row or a dark section can't clip or recolour it.
export const SizeSheet = ({ isOpen, ...sheetProps }: SizeSheetProps) =>
  createPortal(<AnimatePresence>{isOpen && <Sheet {...sheetProps} />}</AnimatePresence>, document.body);
