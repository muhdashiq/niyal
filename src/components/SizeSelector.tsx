import { useId } from 'react';
import { BOTTLE_SIZES } from '../data/perfumes';
import type { BottleSize, Perfume } from '../types';
import { BottleArt } from './BottleArt';
import { Price } from './Price';
import styles from './SizeSelector.module.css';

type SizeSelectorProps = {
  perfume: Pick<Perfume, 'name' | 'accent' | 'image' | 'prices'>;
  value: BottleSize;
  onChange: (size: BottleSize) => void;
};

// Native radio buttons, so arrow keys and screen readers work without any extra code.
export const SizeSelector = ({ perfume, value, onChange }: SizeSelectorProps) => {
  const groupName = useId();

  return (
    <fieldset className={styles.selector}>
      <legend className="text-small text-muted">Choose a size</legend>
      <div className={styles.options}>
        {BOTTLE_SIZES.map((size) => (
          <label key={size} className={styles.option}>
            <input
              type="radio"
              className={styles.input}
              name={groupName}
              checked={size === value}
              onChange={() => onChange(size)}
            />
            <span className={styles.face}>
              <span className={styles.art}>
                <BottleArt perfume={perfume} size={size} decorative />
              </span>
              <span className={styles.size}>{size} ml</span>
              <Price amount={perfume.prices[size]} size="small" />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
