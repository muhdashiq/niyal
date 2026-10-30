import { useRef, useState } from 'react';
import { AnimatedPrice } from '../../components/AnimatedPrice';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import { SizeSelector } from '../../components/SizeSelector';
import { MIN_QUANTITY } from '../../config';
import { formatCurrency } from '../../lib/formatCurrency';
import { useIsOnScreen } from '../../lib/useIsOnScreen';
import type { BottleSize, Perfume } from '../../types';
import { useCartUi } from '../cart/CartUiProvider';
import { AddToBagLabel } from './AddToBagLabel';
import styles from './PurchasePanel.module.css';
import { StickyAddBar } from './StickyAddBar';
import { useAddConfirmation } from './useAddConfirmation';

type PurchasePanelProps = {
  perfume: Perfume;
  size: BottleSize;
  onSizeChange: (size: BottleSize) => void;
};

export const PurchasePanel = ({ perfume, size, onSizeChange }: PurchasePanelProps) => {
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const { addedSize, add } = useAddConfirmation(perfume.id);
  const { openDrawer } = useCartUi();
  const actionRef = useRef<HTMLDivElement>(null);
  const isActionOnScreen = useIsOnScreen(actionRef);
  const unitPrice = perfume.prices[size];
  const total = unitPrice * quantity;

  const addAndOpenDrawer = () => {
    if (add(size, quantity)) openDrawer();
  };

  return (
    <div className={styles.panel}>
      <SizeSelector perfume={perfume} value={size} onChange={onSizeChange} />

      <div className={styles.summary}>
        <div aria-live="polite">
          <AnimatedPrice amount={total} size="large" />
          {quantity > MIN_QUANTITY && (
            <p className="text-small text-muted">{formatCurrency(unitPrice)} each</p>
          )}
        </div>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <div ref={actionRef} className={styles.action}>
        <Button onClick={addAndOpenDrawer}>
          <AddToBagLabel isAdded={addedSize !== null} />
        </Button>
      </div>

      <StickyAddBar
        isVisible={!isActionOnScreen}
        name={perfume.name}
        size={size}
        total={total}
        isAdded={addedSize !== null}
        onAdd={addAndOpenDrawer}
      />
    </div>
  );
};
