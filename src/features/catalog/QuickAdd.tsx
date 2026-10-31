import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { CheckIcon } from '../../components/icons';
import { Price } from '../../components/Price';
import { BOTTLE_SIZES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
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
  const { t, price, formatPrice, formatSize } = useLocale();

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
      <ul className={styles.pills} aria-label={t.catalog.addPerfume(perfume.name)}>
        {BOTTLE_SIZES.map((size) => {
          const sizePrice = price(perfume.prices[size]);
          return (
            <li key={size}>
              <button
                type="button"
                className={styles.pill}
                aria-label={t.catalog.addSize(formatSize(size), formatPrice(sizePrice))}
                onClick={() => add(size)}
              >
                {addedSize === size ? (
                  <span className={styles.pillAdded}>
                    <CheckIcon />
                    {t.common.added}
                  </span>
                ) : (
                  <>
                    <span>{formatSize(size)}</span>
                    <Price amount={sizePrice} size="compact" />
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.touchAdd}>
        <Button
          ref={addButtonRef}
          variant="ghost"
          size="compact"
          aria-label={t.catalog.addPerfume(perfume.name)}
          aria-haspopup="dialog"
          onClick={() => setIsSheetOpen(true)}
        >
          {addedSize ? t.common.added : t.catalog.add}
        </Button>
      </div>

      <SizeSheet perfume={perfume} isOpen={isSheetOpen} onDismiss={dismissSheet} onAdd={addFromSheet} />
    </>
  );
};
