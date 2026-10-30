import { BOTTLE_SIZES, PERFUMES } from '../../data/perfumes';
import { readStorage, writeStorage } from '../../lib/storage';
import type { BottleSize, CartLine, Perfume } from '../../types';
import { cartReducer, type CartState } from './cartReducer';

export const CART_STORAGE_KEY = 'niyal.cart.v1';

const isBottleSize = (value: unknown): value is BottleSize =>
  BOTTLE_SIZES.some((size) => size === value);

const isCartLine = (value: unknown): value is CartLine =>
  typeof value === 'object' &&
  value !== null &&
  'perfumeId' in value &&
  typeof value.perfumeId === 'string' &&
  'size' in value &&
  isBottleSize(value.size) &&
  'quantity' in value &&
  typeof value.quantity === 'number';

const isStillSold = (line: CartLine, perfumes: readonly Perfume[]) => {
  const perfume = perfumes.find((candidate) => candidate.id === line.perfumeId);
  return perfume !== undefined && Number.isFinite(perfume.prices[line.size]);
};

// Rebuilding through ADD also merges duplicates and clamps quantities, so an edited or
// out-of-date saved cart ends up as valid as one built by the customer.
export const parseStoredCart = (
  stored: unknown,
  perfumes: readonly Perfume[] = PERFUMES,
): CartState => {
  if (!Array.isArray(stored)) return [];

  return stored
    .filter(isCartLine)
    .filter((line) => isStillSold(line, perfumes))
    .reduce<CartState>(
      (lines, { perfumeId, size, quantity }) =>
        cartReducer(lines, { type: 'ADD', perfumeId, size, quantity }),
      [],
    );
};

export const loadCart = () => parseStoredCart(readStorage(CART_STORAGE_KEY));

export const saveCart = (lines: CartState) => writeStorage(CART_STORAGE_KEY, lines);
