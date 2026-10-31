import { CURRENCIES, type CurrencyCode } from '../config';

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

// A bare number can't reach a Price, so a rupee figure can't be shown as if it were dollars.
export const moneyFromRupees = (rupees: number, currency: CurrencyCode): Money => {
  const { rupeesPerUnit, roundTo } = CURRENCIES[currency];
  return { amount: Math.ceil(rupees / rupeesPerUnit / roundTo) * roundTo, currency };
};

export const multiplyMoney = ({ amount, currency }: Money, by: number): Money => ({
  amount: amount * by,
  currency,
});

export const addMoney = (first: Money, second: Money): Money => ({
  amount: first.amount + second.amount,
  currency: first.currency,
});

const formatters = new Map<string, Intl.NumberFormat>();

const formatterFor = (currency: CurrencyCode, locale: string) => {
  const key = `${locale}|${currency}`;
  const existing = formatters.get(key);
  if (existing) return existing;
  // No trailing zeros: in Spanish "6,000 KWD" means six dinars but reads as six thousand.
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: CURRENCIES[currency].roundTo < 1 ? 3 : 0,
  });
  formatters.set(key, formatter);
  return formatter;
};

export const formatMoney = ({ amount, currency }: Money, locale: string) =>
  formatterFor(currency, locale).format(amount);
