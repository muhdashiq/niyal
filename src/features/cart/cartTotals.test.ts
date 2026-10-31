import { describe, expect, it } from 'vitest';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../config';
import { moneyFromRupees } from '../../lib/money';
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
  calculateTotals(priceLines(lines, 'INR', [perfumeAt(price30)]), 'INR', 'IN');

describe('priceLines', () => {
  it('works out each line total from the size and quantity', () => {
    const [priced] = priceLines([lineOf(3, 50)], 'INR', [perfumeAt(1000)]);
    expect(priced?.unitPrice.amount).toBe(2000);
    expect(priced?.lineTotal.amount).toBe(6000);
  });

  it('follows the catalog when a price changes', () => {
    const lines = [lineOf(2)];
    expect(priceLines(lines, 'INR', [perfumeAt(1000)])[0]?.lineTotal.amount).toBe(2000);
    expect(priceLines(lines, 'INR', [perfumeAt(1500)])[0]?.lineTotal.amount).toBe(3000);
  });

  it('leaves out a line whose perfume is no longer in the catalog', () => {
    expect(priceLines([{ perfumeId: 'gone', size: 30, quantity: 1 }], 'INR', [perfumeAt(1000)])).toEqual([]);
  });

  it('multiplies the rounded unit price, so lines match what a single bottle costs', () => {
    const [priced] = priceLines([lineOf(3)], 'USD', [perfumeAt(1800)]);
    const unit = moneyFromRupees(1800, 'USD');
    expect(priced?.unitPrice).toEqual(unit);
    expect(priced?.lineTotal.amount).toBe(unit.amount * 3);
    expect(priced?.rupeeTotal).toBe(5400);
  });
});

describe('calculateTotals', () => {
  it('adds up items and prices across lines', () => {
    const totals = totalsFor([lineOf(2, 30), lineOf(1, 50)], 100);
    expect(totals.itemCount).toBe(3);
    expect(totals.subtotal.amount).toBe(400);
  });

  it('charges shipping below the free threshold', () => {
    const subtotal = FREE_SHIPPING_THRESHOLD - 1;
    const totals = totalsFor([lineOf(1)], subtotal);
    expect(totals.shipping).toEqual({ kind: 'flat', fee: { amount: SHIPPING_FEE, currency: 'INR' } });
    expect(totals.total.amount).toBe(subtotal + SHIPPING_FEE);
  });

  it('ships free at the threshold and above', () => {
    const totals = totalsFor([lineOf(1)], FREE_SHIPPING_THRESHOLD);
    expect(totals.shipping).toEqual({ kind: 'free' });
    expect(totals.total.amount).toBe(FREE_SHIPPING_THRESHOLD);
  });

  it('charges nothing for an empty cart', () => {
    expect(calculateTotals([], 'INR', 'IN')).toEqual({
      itemCount: 0,
      subtotal: { amount: 0, currency: 'INR' },
      rupeeSubtotal: 0,
      shipping: { kind: 'free' },
      total: { amount: 0, currency: 'INR' },
    });
  });

  it('applies the free shipping threshold in rupees, whatever the display currency', () => {
    const lines = priceLines([lineOf(1)], 'USD', [perfumeAt(FREE_SHIPPING_THRESHOLD)]);
    expect(calculateTotals(lines, 'USD', 'IN').shipping).toEqual({ kind: 'free' });
  });

  it('converts the shipping fee into the display currency', () => {
    const lines = priceLines([lineOf(1)], 'USD', [perfumeAt(1000)]);
    const totals = calculateTotals(lines, 'USD', 'IN');
    const fee = moneyFromRupees(SHIPPING_FEE, 'USD');
    expect(totals.shipping).toEqual({ kind: 'flat', fee });
    expect(totals.total.amount).toBe(totals.subtotal.amount + fee.amount);
  });

  it('leaves the courier charge out of the total for orders abroad', () => {
    const lines = priceLines([lineOf(1)], 'AED', [perfumeAt(1000)]);
    const totals = calculateTotals(lines, 'AED', 'AE');
    expect(totals.shipping).toEqual({ kind: 'courier' });
    expect(totals.total).toEqual(totals.subtotal);
  });

  it('never gives free shipping abroad, even above the threshold', () => {
    const lines = priceLines([lineOf(1)], 'INR', [perfumeAt(FREE_SHIPPING_THRESHOLD * 2)]);
    expect(calculateTotals(lines, 'INR', 'US').shipping).toEqual({ kind: 'courier' });
  });
});
