import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../config';
import { PERFUMES } from '../../data/perfumes';
import type { CartLine, Perfume } from '../../types';

export type PricedLine = CartLine & {
  perfume: Perfume;
  unitPrice: number;
  lineTotal: number;
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
};

// Prices are looked up here, at render time, and never saved with the cart, so a change
// in perfumes.ts shows up everywhere straight away.
export const priceLines = (
  lines: readonly CartLine[],
  perfumes: readonly Perfume[] = PERFUMES,
): PricedLine[] =>
  lines.flatMap((line) => {
    const perfume = perfumes.find((candidate) => candidate.id === line.perfumeId);
    if (!perfume) return [];
    const unitPrice = perfume.prices[line.size];
    return [{ ...line, perfume, unitPrice, lineTotal: unitPrice * line.quantity }];
  });

export const describeItemCount = (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`;

const shippingFor = (subtotal: number) => {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
};

export const calculateTotals = (lines: readonly PricedLine[]): CartTotals => {
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = shippingFor(subtotal);
  return { itemCount, subtotal, shipping, total: subtotal + shipping };
};
