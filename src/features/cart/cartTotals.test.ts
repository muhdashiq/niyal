import { describe, expect, it } from 'vitest';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../config';
import type { CartLine, Perfume } from '../../types';
import { calculateTotals, priceLines } from './cartTotals';

const perfumeAt = (price30: number): Perfume => ({
  id: 'test',
  name: 'Test',
  tagline: '',
  description: '',
  family: 'Woody',
  notes: { top: [], heart: [], base: [] },
  concentration: 'Eau de Parfum',
  prices: { 30: price30, 50: price30 * 2, 90: price30 * 3, 100: price30 * 4 },
  accent: '#000000',
});

const lineOf = (quantity: number, size: CartLine['size'] = 30): CartLine => ({
  perfumeId: 'test',
  size,
  quantity,
});

const totalsFor = (lines: CartLine[], price30: number) =>
  calculateTotals(priceLines(lines, [perfumeAt(price30)]));

describe('priceLines', () => {
  it('works out each line total from the size and quantity', () => {
    const [priced] = priceLines([lineOf(3, 50)], [perfumeAt(1000)]);
    expect(priced?.unitPrice).toBe(2000);
    expect(priced?.lineTotal).toBe(6000);
  });

  it('follows the catalog when a price changes', () => {
    const lines = [lineOf(2)];
    expect(priceLines(lines, [perfumeAt(1000)])[0]?.lineTotal).toBe(2000);
    expect(priceLines(lines, [perfumeAt(1500)])[0]?.lineTotal).toBe(3000);
  });

  it('leaves out a line whose perfume is no longer in the catalog', () => {
    expect(priceLines([{ perfumeId: 'gone', size: 30, quantity: 1 }], [perfumeAt(1000)])).toEqual([]);
  });
});

describe('calculateTotals', () => {
  it('adds up items and prices across lines', () => {
    const totals = totalsFor([lineOf(2, 30), lineOf(1, 50)], 100);
    expect(totals.itemCount).toBe(3);
    expect(totals.subtotal).toBe(400);
  });

  it('charges shipping below the free threshold', () => {
    const subtotal = FREE_SHIPPING_THRESHOLD - 1;
    const totals = totalsFor([lineOf(1)], subtotal);
    expect(totals.shipping).toBe(SHIPPING_FEE);
    expect(totals.total).toBe(subtotal + SHIPPING_FEE);
  });

  it('ships free at the threshold and above', () => {
    const totals = totalsFor([lineOf(1)], FREE_SHIPPING_THRESHOLD);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(FREE_SHIPPING_THRESHOLD);
  });

  it('charges nothing for an empty cart', () => {
    expect(calculateTotals([])).toEqual({ itemCount: 0, subtotal: 0, shipping: 0, total: 0 });
  });
});
