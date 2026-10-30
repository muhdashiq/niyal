import { describe, expect, it } from 'vitest';
import { MAX_QUANTITY, MIN_QUANTITY } from '../../config';
import { PERFUMES } from '../../data/perfumes';
import { parseStoredCart } from './cartStorage';

const firstPerfume = PERFUMES[0];
if (!firstPerfume) throw new Error('The catalog needs at least one perfume');
const id = firstPerfume.id;

describe('parseStoredCart', () => {
  it('keeps valid lines', () => {
    const lines = [{ perfumeId: id, size: 50, quantity: 2 }];
    expect(parseStoredCart(lines)).toEqual(lines);
  });

  it('drops a line whose perfume no longer exists', () => {
    expect(parseStoredCart([{ perfumeId: 'gone', size: 50, quantity: 1 }])).toEqual([]);
  });

  it('drops a line whose size no longer exists', () => {
    expect(parseStoredCart([{ perfumeId: id, size: 75, quantity: 1 }])).toEqual([]);
  });

  it('drops malformed lines but keeps the good ones', () => {
    const good = { perfumeId: id, size: 30, quantity: 1 };
    const stored = [null, 'text', { perfumeId: id }, { perfumeId: id, size: 30, quantity: '2' }, good];
    expect(parseStoredCart(stored)).toEqual([good]);
  });

  it('clamps quantities into range', () => {
    expect(parseStoredCart([{ perfumeId: id, size: 30, quantity: 99 }])).toEqual([
      { perfumeId: id, size: 30, quantity: MAX_QUANTITY },
    ]);
    expect(parseStoredCart([{ perfumeId: id, size: 30, quantity: -2 }])).toEqual([
      { perfumeId: id, size: 30, quantity: MIN_QUANTITY },
    ]);
  });

  it('merges duplicate lines', () => {
    const line = { perfumeId: id, size: 30, quantity: 2 };
    expect(parseStoredCart([line, line])).toEqual([{ ...line, quantity: 4 }]);
  });

  it('ignores any stored price, keeping only the line itself', () => {
    const [line] = parseStoredCart([{ perfumeId: id, size: 30, quantity: 1, price: 1 }]);
    expect(line).toEqual({ perfumeId: id, size: 30, quantity: 1 });
  });

  it('returns an empty cart for anything that is not a list', () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart({ perfumeId: id })).toEqual([]);
    expect(parseStoredCart('text')).toEqual([]);
  });
});
