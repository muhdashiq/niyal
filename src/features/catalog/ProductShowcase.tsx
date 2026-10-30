import { type ReactNode, useId } from 'react';
import { RevealGroup, RevealItem, RevealListItem } from '../../components/Reveal';
import type { Perfume } from '../../types';
import { ProductCard } from './ProductCard';
import styles from './ProductShowcase.module.css';

type ProductShowcaseProps = {
  title: string;
  perfumes: readonly Perfume[];
  action?: ReactNode;
};

export const ProductShowcase = ({ title, perfumes, action }: ProductShowcaseProps) => {
  const headingId = useId();

  return (
    <section data-surface="dark" className={styles.showcase} aria-labelledby={headingId}>
      <RevealGroup>
        <RevealItem className={`page-width ${styles.heading}`}>
          <h2 id={headingId}>{title}</h2>
          {action}
        </RevealItem>
        <ul className={`page-width ${styles.row}`}>
          {perfumes.map((perfume) => (
            <RevealListItem key={perfume.id} className={styles.item}>
              <ProductCard perfume={perfume} />
            </RevealListItem>
          ))}
        </ul>
      </RevealGroup>
    </section>
  );
};
