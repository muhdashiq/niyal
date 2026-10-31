import { describe, expect, it } from 'vitest';
import { CURRENCIES, CURRENCY_CODES } from '../config';
import { addMoney, formatMoney, moneyFromRupees, multiplyMoney } from './money';

describe('moneyFromRupees', () => {
  it('leaves rupee prices exactly as they are', () => {
    expect(moneyFromRupees(3200, 'INR')).toEqual({ amount: 3200, currency: 'INR' });
  });

  it('rounds up, so a bottle never sells below its rupee price', () => {
    for (const currency of CURRENCY_CODES) {
      const { amount } = moneyFromRupees(1801, currency);
      expect(amount * CURRENCIES[currency].rupeesPerUnit).toBeGreaterThanOrEqual(1801);
    }
  });

  it('lands on the rounding step of each currency', () => {
    expect(Number.isInteger(moneyFromRupees(1800, 'USD').amount)).toBe(true);
    expect(moneyFromRupees(1800, 'KWD').amount % 0.5).toBe(0);
  });
});

describe('order arithmetic', () => {
  it('stays exact in the three-decimal currencies', () => {
    const unit = moneyFromRupees(1800, 'BHD');
    const lineTotal = multiplyMoney(unit, 3);
    expect(addMoney(lineTotal, unit).amount).toBe(unit.amount * 4);
  });
});

describe('formatMoney', () => {
  it('keeps the Indian format for rupees', () => {
    expect(formatMoney({ amount: 125000, currency: 'INR' }, 'en-IN')).toBe('₹1,25,000');
  });

  it('shows no decimals on whole amounts', () => {
    expect(formatMoney({ amount: 19, currency: 'USD' }, 'en-IN')).toBe('$19');
    expect(formatMoney({ amount: 6, currency: 'KWD' }, 'en-IN')).toBe('KWD\u00a06');
  });

  it('shows a half unit where a currency rounds to one', () => {
    expect(formatMoney({ amount: 6.5, currency: 'KWD' }, 'en-IN')).toBe('KWD\u00a06.5');
    expect(formatMoney({ amount: 6.5, currency: 'KWD' }, 'es')).toContain('6,5');
  });

  it('writes Arabic prices in Western digits', () => {
    expect(formatMoney({ amount: 70, currency: 'AED' }, 'ar-u-nu-latn')).toContain('70');
  });
});
