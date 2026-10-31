import { type CurrencyCode, FREE_SHIPPING_THRESHOLD, HOME_COUNTRY, SHIPPING_FEE } from '../../config';
import { PERFUMES } from '../../data/perfumes';
import { addMoney, type Money, moneyFromRupees, multiplyMoney } from '../../lib/money';
import type { CartLine, Perfume } from '../../types';

export type PricedLine = CartLine & {
  perfume: Perfume;
  unitPrice: Money;
  lineTotal: Money;
  rupeeTotal: number;
};

export type Shipping =
  | { kind: 'free' }
  | { kind: 'flat'; fee: Money }
  | { kind: 'courier' }; // charged at cost and agreed on WhatsApp, so it's never in the total

export type CartTotals = {
  itemCount: number;
  subtotal: Money;
  rupeeSubtotal: number; // the free shipping threshold and the merchant's records are in rupees
  shipping: Shipping;
  total: Money;
};

// Prices are looked up here, at render time, and never saved with the cart, so a change
// in perfumes.ts shows up everywhere straight away. Each unit is converted and rounded once,
// then multiplied, so the lines always add up to the subtotal the customer sees.
export const priceLines = (
  lines: readonly CartLine[],
  currency: CurrencyCode,
  perfumes: readonly Perfume[] = PERFUMES,
): PricedLine[] =>
  lines.flatMap((line) => {
    const perfume = perfumes.find((candidate) => candidate.id === line.perfumeId);
    if (!perfume) return [];
    const unitPrice = moneyFromRupees(perfume.prices[line.size], currency);
    return [
      {
        ...line,
        perfume,
        unitPrice,
        lineTotal: multiplyMoney(unitPrice, line.quantity),
        rupeeTotal: perfume.prices[line.size] * line.quantity,
      },
    ];
  });

const shippingFor = (rupeeSubtotal: number, currency: CurrencyCode, country: string): Shipping => {
  if (country !== HOME_COUNTRY) return { kind: 'courier' };
  if (rupeeSubtotal === 0 || rupeeSubtotal >= FREE_SHIPPING_THRESHOLD) return { kind: 'free' };
  return { kind: 'flat', fee: moneyFromRupees(SHIPPING_FEE, currency) };
};

export const calculateTotals = (
  lines: readonly PricedLine[],
  currency: CurrencyCode,
  country: string,
): CartTotals => {
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => addMoney(sum, line.lineTotal), { amount: 0, currency });
  const rupeeSubtotal = lines.reduce((sum, line) => sum + line.rupeeTotal, 0);
  const shipping = shippingFor(rupeeSubtotal, currency, country);
  const total = shipping.kind === 'flat' ? addMoney(subtotal, shipping.fee) : subtotal;
  return { itemCount, subtotal, rupeeSubtotal, shipping, total };
};
