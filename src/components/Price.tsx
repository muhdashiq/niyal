import { useLocale } from '../i18n/LocaleProvider';
import type { Money } from '../lib/money';
import styles from './Price.module.css';

type PriceSize = 'compact' | 'small' | 'medium' | 'large';

type PriceProps = {
  amount: Money;
  size?: PriceSize;
};

export const Price = ({ amount, size = 'medium' }: PriceProps) => {
  const { formatPrice } = useLocale();

  return <span className={`${styles.price} ${styles[size]}`}>{formatPrice(amount)}</span>;
};
