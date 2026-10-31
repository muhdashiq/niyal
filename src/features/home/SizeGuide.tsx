import { RevealGroup, RevealItem } from '../../components/Reveal';
import { ShelfBottle } from '../../components/ShelfBottle';
import { BOTTLE_SIZES, FEATURED_PERFUMES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import styles from './SizeGuide.module.css';

const GUIDE_PERFUME = FEATURED_PERFUMES[1] ?? FEATURED_PERFUMES[0];

export const SizeGuide = () => {
  const { t, formatSize } = useLocale();

  return (
    <section data-surface="light" className={styles.guide} aria-labelledby="sizes-heading">
      <RevealGroup className="page-width">
        <RevealItem>
          <h2 id="sizes-heading">{t.home.sizesTitle}</h2>
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
              <dt className="text-h3">{formatSize(size)}</dt>
              <dd className="text-muted">{t.home.sizeAdvice[size]}</dd>
            </RevealItem>
          ))}
        </dl>
      </RevealGroup>
    </section>
  );
};
