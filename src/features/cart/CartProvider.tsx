import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { BottleSize, CartLine } from '../../types';
import { cartReducer } from './cartReducer';
import { CART_STORAGE_KEY, loadCart, saveCart } from './cartStorage';
import { calculateTotals, type CartTotals, priceLines, type PricedLine } from './cartTotals';

type CartActions = {
  add: (perfumeId: string, size: BottleSize, quantity?: number) => void;
  remove: (perfumeId: string, size: BottleSize) => void;
  setQuantity: (perfumeId: string, size: BottleSize, quantity: number) => void;
  changeSize: (perfumeId: string, size: BottleSize, newSize: BottleSize) => void;
  restore: (line: CartLine, index: number) => void;
  clear: () => void;
};

type CartContextValue = CartTotals &
  CartActions & {
    lines: readonly PricedLine[];
  };

type CartProviderProps = {
  children: ReactNode;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [storedLines, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => saveCart(storedLines), [storedLines]);

  // Without this, two open tabs would overwrite each other's bags.
  useEffect(() => {
    const syncFromOtherTab = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY || event.key === null) {
        dispatch({ type: 'REPLACE', lines: loadCart() });
      }
    };
    window.addEventListener('storage', syncFromOtherTab);
    return () => window.removeEventListener('storage', syncFromOtherTab);
  }, []);

  const lines = useMemo(() => priceLines(storedLines), [storedLines]);
  const totals = useMemo(() => calculateTotals(lines), [lines]);

  const actions = useMemo<CartActions>(
    () => ({
      add: (perfumeId, size, quantity) => dispatch({ type: 'ADD', perfumeId, size, quantity }),
      remove: (perfumeId, size) => dispatch({ type: 'REMOVE', perfumeId, size }),
      setQuantity: (perfumeId, size, quantity) =>
        dispatch({ type: 'SET_QUANTITY', perfumeId, size, quantity }),
      changeSize: (perfumeId, size, newSize) =>
        dispatch({ type: 'CHANGE_SIZE', perfumeId, size, newSize }),
      restore: (line, index) => dispatch({ type: 'RESTORE', line, index }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [],
  );

  const value = useMemo(() => ({ lines, ...totals, ...actions }), [lines, totals, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const cart = useContext(CartContext);
  if (!cart) throw new Error('useCart must be used inside CartProvider');
  return cart;
};
