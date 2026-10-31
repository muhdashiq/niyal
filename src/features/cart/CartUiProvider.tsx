import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { MAX_QUANTITY, MIN_QUANTITY } from '../../config';
import type { BottleSize, CartLine } from '../../types';
import { useCart } from './CartProvider';
import type { PricedLine } from './cartTotals';

const TOAST_MS = 4000;

export type CartToast =
  | { kind: 'removed'; line: CartLine; index: number; name: string }
  | { kind: 'limit' };

type CartUiValue = {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  dismissDrawer: () => void;
  closeDrawerForNavigation: () => void;
  toast: CartToast | null;
  addToBag: (perfumeId: string, size: BottleSize, quantity?: number) => boolean;
  changeLineSize: (line: PricedLine, newSize: BottleSize) => void;
  removeLine: (line: PricedLine) => void;
  undoRemoval: () => void;
  pauseToastTimer: () => void;
  resumeToastTimer: () => void;
  takeRequestedLineFocus: () => string | null;
};

type CartUiProviderProps = {
  children: ReactNode;
};

const CartUiContext = createContext<CartUiValue | null>(null);

export const lineKey = (perfumeId: string, size: BottleSize) => `${perfumeId}-${size}`;

export const CartUiProvider = ({ children }: CartUiProviderProps) => {
  const { lines, add, changeSize, remove, restore } = useCart();
  const { pathname } = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);
  const drawerTrigger = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const requestedLineFocus = useRef<string | null>(null);

  const openDrawer = useCallback(() => {
    drawerTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsDrawerOpen(true);
  }, []);

  const dismissDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    drawerTrigger.current?.focus();
  }, []);

  const closeDrawerForNavigation = useCallback(() => setIsDrawerOpen(false), []);

  // Covers the browser's back button, which changes the page without touching the drawer.
  useEffect(() => setIsDrawerOpen(false), [pathname]);

  const startToastTimer = useCallback(() => {
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback(
    (nextToast: CartToast) => {
      setToast(nextToast);
      startToastTimer();
    },
    [startToastTimer],
  );

  // Returns false when the bag already holds the limit, so the caller doesn't say "Added".
  const addToBag = useCallback(
    (perfumeId: string, size: BottleSize, quantity = MIN_QUANTITY) => {
      const existing = lines.find((line) => line.perfumeId === perfumeId && line.size === size);
      const held = existing?.quantity ?? 0;
      if (held + quantity > MAX_QUANTITY) showToast({ kind: 'limit' });
      if (held >= MAX_QUANTITY) return false;
      add(perfumeId, size, quantity);
      return true;
    },
    [lines, add, showToast],
  );

  const changeLineSize = useCallback(
    ({ perfumeId, size, quantity }: PricedLine, newSize: BottleSize) => {
      const colliding = lines.find((line) => line.perfumeId === perfumeId && line.size === newSize);
      if (colliding && colliding.quantity + quantity > MAX_QUANTITY) {
        showToast({ kind: 'limit' });
      }
      // A new size means a new list item, so focus has to be sent on to it explicitly.
      requestedLineFocus.current = lineKey(perfumeId, newSize);
      changeSize(perfumeId, size, newSize);
    },
    [lines, changeSize, showToast],
  );

  const removeLine = useCallback(
    ({ perfumeId, size, quantity, perfume }: PricedLine) => {
      const index = lines.findIndex((line) => line.perfumeId === perfumeId && line.size === size);
      remove(perfumeId, size);
      showToast({ kind: 'removed', line: { perfumeId, size, quantity }, index, name: perfume.name });
    },
    [lines, remove, showToast],
  );

  const undoRemoval = useCallback(() => {
    if (toast?.kind !== 'removed') return;
    clearTimeout(toastTimer.current);
    requestedLineFocus.current = lineKey(toast.line.perfumeId, toast.line.size);
    restore(toast.line, toast.index);
    setToast(null);
  }, [toast, restore]);

  const pauseToastTimer = useCallback(() => clearTimeout(toastTimer.current), []);

  const takeRequestedLineFocus = useCallback(() => {
    const requested = requestedLineFocus.current;
    requestedLineFocus.current = null;
    return requested;
  }, []);

  const value = useMemo(
    () => ({
      isDrawerOpen,
      openDrawer,
      dismissDrawer,
      closeDrawerForNavigation,
      toast,
      addToBag,
      changeLineSize,
      removeLine,
      undoRemoval,
      pauseToastTimer,
      resumeToastTimer: startToastTimer,
      takeRequestedLineFocus,
    }),
    [
      isDrawerOpen,
      openDrawer,
      dismissDrawer,
      closeDrawerForNavigation,
      toast,
      addToBag,
      changeLineSize,
      removeLine,
      undoRemoval,
      pauseToastTimer,
      startToastTimer,
      takeRequestedLineFocus,
    ],
  );

  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
};

export const useCartUi = () => {
  const cartUi = useContext(CartUiContext);
  if (!cartUi) throw new Error('useCartUi must be used inside CartUiProvider');
  return cartUi;
};
