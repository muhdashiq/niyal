import { RevealGroup, RevealItem } from '../../components/Reveal';
import { ShelfBottle } from '../../components/ShelfBottle';
import { BOTTLE_SIZES, FEATURED_PERFUMES } from '../../data/perfumes';
import type { BottleSize } from '../../types';
import styles from './SizeGuide.module.css';

const SIZE_ADVICE: Record<BottleSize, string> = {
  30: 'To try something new, or to carry in a bag.',
  50: 'For a perfume you wear most days.',
  90: 'For a signature you already know you love.',
  100: 'The lowest price per ml, for the one you never want to run out of.',
};

const GUIDE_PERFUME = FEATURED_PERFUMES[1] ?? FEATURED_PERFUMES[0];

export const SizeGuide = () => (
  <section data-surface="light" className={styles.guide} aria-labelledby="sizes-heading">
    <RevealGroup className="page-width">
      <RevealItem>
        <h2 id="sizes-heading">Which size is right for you</h2>
      </RevealItem>

      {GUIDE_PERFUME && (
        <div className={styles.shelf}>
          {BOTTLE_SIZES.map((size) => (
            <RevealItem key={size}>
              <ShelfBottle perfume={GUIDE_PERFUME} size={size} decorative />
            </RevealItem>
          ))}
        </div>
      )}

      <dl className={styles.advice}>
        {BOTTLE_SIZES.map((size) => (
          <RevealItem key={size} className={styles.size}>
            <dt className="text-h3">{size} ml</dt>
            <dd className="text-muted">{SIZE_ADVICE[size]}</dd>
          </RevealItem>
        ))}
      </dl>
    </RevealGroup>
  </section>
);
