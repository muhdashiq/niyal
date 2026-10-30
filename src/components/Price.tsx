import { formatCurrency } from '../lib/formatCurrency';
import styles from './Price.module.css';

type PriceSize = 'small' | 'medium' | 'large';

type PriceProps = {
  amount: number;
  size?: PriceSize;
};

export const Price = ({ amount, size = 'medium' }: PriceProps) => (
  <span className={`${styles.price} ${styles[size]}`}>{formatCurrency(amount)}</span>
);
