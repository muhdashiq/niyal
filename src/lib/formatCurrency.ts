import { CURRENCY, LOCALE } from '../config';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number) => currencyFormatter.format(amount);
