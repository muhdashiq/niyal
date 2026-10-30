import { useEffect, useState } from 'react';
import { AmbientLight } from '../../components/AmbientLight';
import { ShelfBottle } from '../../components/ShelfBottle';
import { Tag } from '../../components/Tag';
import { DEFAULT_BOTTLE_SIZE, PERFUMES } from '../../data/perfumes';
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
  usePageMeta({ title: perfume.name, description: `${perfume.tagline} ${perfume.description}` });

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
              <Tag>{perfume.family}</Tag>
              <p className="text-label text-muted">{perfume.concentration}</p>
            </div>
            <h1>{perfume.name}</h1>
            <p className="text-lead text-muted">{perfume.tagline}</p>
          </header>
          <p>{perfume.description}</p>
          <PurchasePanel perfume={perfume} size={size} onSizeChange={setSize} />
          <NotesPyramid perfume={perfume} />
        </div>
      </div>

      <ProductShowcase title="You may also like" perfumes={selectRelatedPerfumes(PERFUMES, perfume)} />
    </>
  );
};
