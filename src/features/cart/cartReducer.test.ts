import { describe, expect, it } from 'vitest';
import { MAX_QUANTITY, MIN_QUANTITY } from '../../config';
import type { CartLine } from '../../types';
import { cartReducer, type CartState } from './cartReducer';

const oud = (size: CartLine['size'], quantity: number): CartLine => ({
  perfumeId: 'oud',
  size,
  quantity,
});

// Freezing makes any accidental mutation inside the reducer throw.
const frozen = (lines: CartLine[]): CartState =>
  Object.freeze(lines.map((line) => Object.freeze(line)));

describe('ADD', () => {
  it('creates a line, with a quantity of one by default', () => {
    const state = cartReducer([], { type: 'ADD', perfumeId: 'oud', size: 50 });
    expect(state).toEqual([oud(50, 1)]);
  });

  it('increases the quantity of an existing perfume and size instead of duplicating it', () => {
    const state = cartReducer(frozen([oud(50, 2)]), {
      type: 'ADD',
      perfumeId: 'oud',
      size: 50,
      quantity: 3,
    });
    expect(state).toEqual([oud(50, 5)]);
  });

  it('keeps the same perfume in a different size as a separate line', () => {
    const state = cartReducer(frozen([oud(50, 1)]), { type: 'ADD', perfumeId: 'oud', size: 100 });
    expect(state).toEqual([oud(50, 1), oud(100, 1)]);
  });

  it('clamps a merged quantity to the maximum', () => {
    const state = cartReducer(frozen([oud(50, MAX_QUANTITY - 1)]), {
      type: 'ADD',
      perfumeId: 'oud',
      size: 50,
      quantity: 5,
    });
    expect(state).toEqual([oud(50, MAX_QUANTITY)]);
  });
});

describe('CHANGE_SIZE', () => {
  it('moves a line to the new size', () => {
    const state = cartReducer(frozen([oud(50, 2)]), {
      type: 'CHANGE_SIZE',
      perfumeId: 'oud',
      size: 50,
      newSize: 90,
    });
    expect(state).toEqual([oud(90, 2)]);
  });

  it('merges with a line that already has the new size, keeping the edited position', () => {
    const rose: CartLine = { perfumeId: 'rose', size: 30, quantity: 1 };
    const state = cartReducer(frozen([oud(100, 4), rose, oud(50, 2)]), {
      type: 'CHANGE_SIZE',
      perfumeId: 'oud',
      size: 50,
      newSize: 100,
    });
    expect(state).toEqual([rose, oud(100, 6)]);
  });

  it('clamps a merged quantity to the maximum', () => {
    const state = cartReducer(frozen([oud(50, 8), oud(100, 8)]), {
      type: 'CHANGE_SIZE',
      perfumeId: 'oud',
      size: 50,
      newSize: 100,
    });
    expect(state).toEqual([oud(100, MAX_QUANTITY)]);
  });

  it('changes nothing when the size is the same or the line is missing', () => {
    const initial = frozen([oud(50, 2)]);
    const sameSize = { type: 'CHANGE_SIZE', perfumeId: 'oud', size: 50, newSize: 50 } as const;
    const missingLine = { type: 'CHANGE_SIZE', perfumeId: 'oud', size: 30, newSize: 50 } as const;
    expect(cartReducer(initial, sameSize)).toBe(initial);
    expect(cartReducer(initial, missingLine)).toBe(initial);
  });
});

describe('SET_QUANTITY', () => {
  const setQuantity = (quantity: number) =>
    cartReducer(frozen([oud(50, 2)]), { type: 'SET_QUANTITY', perfumeId: 'oud', size: 50, quantity });

  it('sets the quantity', () => {
    expect(setQuantity(4)).toEqual([oud(50, 4)]);
  });

  it('clamps to the minimum and maximum', () => {
    expect(setQuantity(0)).toEqual([oud(50, MIN_QUANTITY)]);
    expect(setQuantity(-3)).toEqual([oud(50, MIN_QUANTITY)]);
    expect(setQuantity(99)).toEqual([oud(50, MAX_QUANTITY)]);
  });

  it('treats a value that is not a number as the minimum', () => {
    expect(setQuantity(Number.NaN)).toEqual([oud(50, MIN_QUANTITY)]);
  });
});

describe('RESTORE', () => {
  const rose: CartLine = { perfumeId: 'rose', size: 30, quantity: 1 };

  it('puts a removed line back in its original position', () => {
    const state = cartReducer(frozen([oud(50, 1), rose]), {
      type: 'RESTORE',
      line: oud(100, 2),
      index: 1,
    });
    expect(state).toEqual([oud(50, 1), oud(100, 2), rose]);
  });

  it('merges if the same perfume and size has been added again since', () => {
    const state = cartReducer(frozen([rose, oud(50, 1)]), {
      type: 'RESTORE',
      line: oud(50, 2),
      index: 0,
    });
    expect(state).toEqual([rose, oud(50, 3)]);
  });
});

describe('REMOVE and CLEAR', () => {
  it('removes only the matching perfume and size', () => {
    const state = cartReducer(frozen([oud(50, 1), oud(100, 1)]), {
      type: 'REMOVE',
      perfumeId: 'oud',
      size: 50,
    });
    expect(state).toEqual([oud(100, 1)]);
  });

  it('empties the cart', () => {
    expect(cartReducer(frozen([oud(50, 1)]), { type: 'CLEAR' })).toEqual([]);
  });
});
