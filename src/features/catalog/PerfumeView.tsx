import { useEffect, useState } from 'react';
import { AmbientLight } from '../../components/AmbientLight';
import { ShelfBottle } from '../../components/ShelfBottle';
import { Tag } from '../../components/Tag';
import { DEFAULT_BOTTLE_SIZE, PERFUMES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import { localisePerfume } from '../../i18n/localisePerfume';
import { usePageMeta } from '../../lib/usePageMeta';
import type { BottleSize, Perfume } from '../../types';
import { NotesPyramid } from './NotesPyramid';
import styles from './PerfumeView.module.css';
import { ProductShowcase } from './ProductShowcase';
import { PurchasePanel } from './PurchasePanel';
import { selectRelatedPerfumes } from './selectPerfumes';

type PerfumeViewProps = {
  perfume: Perfume;
};

export const PerfumeView = ({ perfume }: PerfumeViewProps) => {
  const [size, setSize] = useState<BottleSize>(DEFAULT_BOTTLE_SIZE);
  const { t } = useLocale();
  const { tagline, description, family, concentration } = localisePerfume(perfume, t);
  usePageMeta({ title: perfume.name, description: `${tagline} ${description}` });

  // Tells the rest of the page to leave room at the bottom for the sticky bar on phones.
  useEffect(() => {
    document.documentElement.dataset.bottomBar = 'true';
    return () => {
      delete document.documentElement.dataset.bottomBar;
    };
  }, []);

  return (
    <>
      <div className={styles.layout}>
        <div data-surface="dark" className={styles.stageColumn}>
          <div className={styles.stage}>
            <AmbientLight accent={perfume.accent} />
            <div className={styles.shelf}>
              <div className={styles.bottle}>
                <ShelfBottle perfume={perfume} size={size} priority />
              </div>
            </div>
            <div aria-hidden="true" className={styles.ledge} />
          </div>
        </div>

        <div className={styles.details}>
          <header className={styles.intro}>
            <div className={styles.meta}>
              <Tag>{family}</Tag>
              <p className="text-label text-muted">{concentration}</p>
            </div>
            <h1 lang="en">{perfume.name}</h1>
            <p className="text-lead text-muted">{tagline}</p>
          </header>
          <p>{description}</p>
          <PurchasePanel perfume={perfume} size={size} onSizeChange={setSize} />
          <NotesPyramid perfume={perfume} />
        </div>
      </div>

      <ProductShowcase title={t.catalog.related} perfumes={selectRelatedPerfumes(PERFUMES, perfume)} />
    </>
  );
};
