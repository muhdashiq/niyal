import { MAX_QUANTITY, MIN_QUANTITY } from '../../config';
import type { BottleSize, CartLine } from '../../types';

export type CartState = readonly CartLine[];

export type CartAction =
  | { type: 'ADD'; perfumeId: string; size: BottleSize; quantity?: number }
  | { type: 'REMOVE'; perfumeId: string; size: BottleSize }
  | { type: 'SET_QUANTITY'; perfumeId: string; size: BottleSize; quantity: number }
  | { type: 'CHANGE_SIZE'; perfumeId: string; size: BottleSize; newSize: BottleSize }
  | { type: 'RESTORE'; line: CartLine; index: number }
  | { type: 'REPLACE'; lines: CartState }
  | { type: 'CLEAR' };

export const clampQuantity = (quantity: number) => {
  if (!Number.isFinite(quantity)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(quantity)));
};

const isLine = (line: CartLine, perfumeId: string, size: BottleSize) =>
  line.perfumeId === perfumeId && line.size === size;

const addLine = (
  state: CartState,
  perfumeId: string,
  size: BottleSize,
  quantity: number,
): CartState => {
  const hasLine = state.some((line) => isLine(line, perfumeId, size));
  if (!hasLine) return [...state, { perfumeId, size, quantity: clampQuantity(quantity) }];

  return state.map((line) =>
    isLine(line, perfumeId, size)
      ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
      : line,
  );
};

const changeLineSize = (
  state: CartState,
  perfumeId: string,
  size: BottleSize,
  newSize: BottleSize,
): CartState => {
  const line = state.find((candidate) => isLine(candidate, perfumeId, size));
  if (!line || size === newSize) return state;

  const collidingLine = state.find((candidate) => isLine(candidate, perfumeId, newSize));
  const quantity = clampQuantity(line.quantity + (collidingLine?.quantity ?? 0));

  // The merged line stays where the customer was editing, and the line it absorbed goes.
  return state
    .filter((candidate) => candidate !== collidingLine)
    .map((candidate) => (candidate === line ? { perfumeId, size: newSize, quantity } : candidate));
};

// Undo puts a removed line back where it was, unless the customer has added the same
// perfume and size again in the meantime, in which case the two merge.
const restoreLine = (state: CartState, line: CartLine, index: number): CartState => {
  const { perfumeId, size, quantity } = line;
  if (state.some((candidate) => isLine(candidate, perfumeId, size))) {
    return addLine(state, perfumeId, size, quantity);
  }
  return [...state.slice(0, index), line, ...state.slice(index)];
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD':
      return addLine(state, action.perfumeId, action.size, action.quantity ?? MIN_QUANTITY);
    case 'REMOVE':
      return state.filter((line) => !isLine(line, action.perfumeId, action.size));
    case 'SET_QUANTITY':
      return state.map((line) =>
        isLine(line, action.perfumeId, action.size)
          ? { ...line, quantity: clampQuantity(action.quantity) }
          : line,
      );
    case 'CHANGE_SIZE':
      return changeLineSize(state, action.perfumeId, action.size, action.newSize);
    case 'RESTORE':
      return restoreLine(state, action.line, action.index);
    case 'REPLACE':
      return action.lines;
    case 'CLEAR':
      return [];
  }
};
