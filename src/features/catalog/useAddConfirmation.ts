import { useEffect, useRef, useState } from 'react';
import type { BottleSize } from '../../types';
import { useCartUi } from '../cart/CartUiProvider';

const CONFIRMATION_MS = 1600;

// Adds to the bag and remembers the size for a moment, so the control can confirm it.
// Returns whether anything was added, because a size already at the limit can't take more.
export const useAddConfirmation = (perfumeId: string) => {
  const { addToBag } = useCartUi();
  const [addedSize, setAddedSize] = useState<BottleSize | null>(null);
  const confirmationTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(confirmationTimer.current), []);

  const add = (size: BottleSize, quantity?: number) => {
    const wasAdded = addToBag(perfumeId, size, quantity);
    if (wasAdded) {
      setAddedSize(size);
      clearTimeout(confirmationTimer.current);
      confirmationTimer.current = setTimeout(() => setAddedSize(null), CONFIRMATION_MS);
    }
    return wasAdded;
  };

  return { addedSize, add };
};
