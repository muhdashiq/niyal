import { Link } from 'react-router-dom';
import { Price } from '../../components/Price';
import { ShelfBottle } from '../../components/ShelfBottle';
import { Tag } from '../../components/Tag';
import { DEFAULT_BOTTLE_SIZE } from '../../data/perfumes';
import type { Perfume } from '../../types';
import styles from './ProductCard.module.css';
import { QuickAdd } from './QuickAdd';
import { startingPrice } from './selectPerfumes';

type ProductCardProps = {
  perfume: Perfume;
};

export const ProductCard = ({ perfume }: ProductCardProps) => (
  <article className={styles.card}>
    <div className={styles.shelf}>
      <div className={styles.bottle}>
        <ShelfBottle perfume={perfume} size={DEFAULT_BOTTLE_SIZE} decorative />
      </div>
    </div>
    <div className={styles.details}>
      <h3>
        <Link to={`/perfume/${perfume.id}`} className={styles.link}>
          {perfume.name}
        </Link>
      </h3>
      <p className="text-lead text-muted">{perfume.tagline}</p>
      <div className={styles.footer}>
        <div className={styles.meta}>
          <Tag>{perfume.family}</Tag>
          <p className="text-small text-muted">
            From <Price amount={startingPrice(perfume)} />
          </p>
        </div>
        <QuickAdd perfume={perfume} />
      </div>
    </div>
  </article>
);
