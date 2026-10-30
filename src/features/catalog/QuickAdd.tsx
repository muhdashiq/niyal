import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { CheckIcon } from '../../components/icons';
import { Price } from '../../components/Price';
import { BOTTLE_SIZES } from '../../data/perfumes';
import { formatCurrency } from '../../lib/formatCurrency';
import type { BottleSize, Perfume } from '../../types';
import styles from './ProductCard.module.css';
import { SizeSheet } from './SizeSheet';
import { useAddConfirmation } from './useAddConfirmation';

type QuickAddProps = {
  perfume: Perfume;
};

// Pointer devices get a row of size pills on hover. Touch devices get an Add button that
// opens a bottom sheet. ProductCard.module.css shows whichever suits the device.
export const QuickAdd = ({ perfume }: QuickAddProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { addedSize, add } = useAddConfirmation(perfume.id);

  const dismissSheet = () => {
    setIsSheetOpen(false);
    addButtonRef.current?.focus();
  };

  const addFromSheet = (size: BottleSize) => {
    add(size);
    dismissSheet();
  };

  return (
    <>
      <ul className={styles.pills} aria-label={`Add ${perfume.name} to your bag`}>
        {BOTTLE_SIZES.map((size) => (
          <li key={size}>
            <button
              type="button"
              className={styles.pill}
              aria-label={`Add ${size} ml for ${formatCurrency(perfume.prices[size])}`}
              onClick={() => add(size)}
            >
              {addedSize === size ? (
                <span className={styles.pillAdded}>
                  <CheckIcon />
                  Added
                </span>
              ) : (
                <>
                  <span>{size} ml</span>
                  <Price amount={perfume.prices[size]} size="small" />
                </>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.touchAdd}>
        <Button
          ref={addButtonRef}
          variant="ghost"
          size="compact"
          aria-label={`Add ${perfume.name} to your bag`}
          aria-haspopup="dialog"
          onClick={() => setIsSheetOpen(true)}
        >
          {addedSize ? 'Added' : 'Add'}
        </Button>
      </div>

      <SizeSheet perfume={perfume} isOpen={isSheetOpen} onDismiss={dismissSheet} onAdd={addFromSheet} />
    </>
  );
};
