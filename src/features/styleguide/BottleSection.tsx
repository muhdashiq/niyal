import { useState } from 'react';
import { BottleArt } from '../../components/BottleArt';
import { Button } from '../../components/Button';
import { BOTTLE_SIZES, PERFUMES } from '../../data/perfumes';
import type { BottleSize, Perfume } from '../../types';
import styles from './Styleguide.module.css';

type Surface = 'dark' | 'light';

const SizeRow = ({ perfume }: { perfume: Perfume }) => (
  <ul className={styles.bottleRow}>
    {BOTTLE_SIZES.map((size) => (
      <li key={size}>
        <BottleArt perfume={perfume} size={size} />
      </li>
    ))}
  </ul>
);

const BottlePanel = ({ surface, selectedSize }: { surface: Surface; selectedSize: BottleSize }) => (
  <div data-surface={surface} className={styles.panel}>
    <ul className={styles.bottleGrid}>
      {PERFUMES.map((perfume) => (
        <li key={perfume.id}>
          <BottleArt perfume={perfume} size={selectedSize} />
        </li>
      ))}
    </ul>
    {PERFUMES[0] && <SizeRow perfume={PERFUMES[0]} />}
    {PERFUMES[1] && (
      <div className={styles.bottleLarge}>
        <BottleArt perfume={PERFUMES[1]} size={selectedSize} />
      </div>
    )}
  </div>
);

export const BottleSection = () => {
  const [selectedSize, setSelectedSize] = useState<BottleSize>(50);

  return (
    <section aria-labelledby="bottles-heading">
      <div data-surface="light" className={styles.band}>
        <h2 id="bottles-heading" className={styles.sectionHeading}>
          Bottle art
        </h2>
        <div className={styles.row}>
          {BOTTLE_SIZES.map((size) => (
            <Button
              key={size}
              variant={size === selectedSize ? 'primary' : 'ghost'}
              onClick={() => setSelectedSize(size)}
            >
              {size} ml
            </Button>
          ))}
        </div>
      </div>
      <div className={styles.split}>
        <BottlePanel surface="dark" selectedSize={selectedSize} />
        <BottlePanel surface="light" selectedSize={selectedSize} />
      </div>
    </section>
  );
};
