import { MAX_QUANTITY, MIN_QUANTITY } from '../config';
import { IconButton } from './IconButton';
import { MinusIcon, PlusIcon } from './icons';
import styles from './QuantityStepper.module.css';

type QuantityStepperProps = {
  value: number;
  onChange: (quantity: number) => void;
  label?: string;
  announceChanges?: boolean; // off where something else already reads the change out
};

// aria-disabled rather than disabled, so a keyboard user who reaches the limit keeps their focus.
export const QuantityStepper = ({
  value,
  onChange,
  label = 'Quantity',
  announceChanges = true,
}: QuantityStepperProps) => {
  const canDecrease = value > MIN_QUANTITY;
  const canIncrease = value < MAX_QUANTITY;

  return (
    <div role="group" aria-label={label} className={styles.stepper}>
      <IconButton
        label="Decrease quantity"
        aria-disabled={!canDecrease}
        onClick={() => canDecrease && onChange(value - 1)}
      >
        <MinusIcon />
      </IconButton>
      <output className={styles.value} aria-live={announceChanges ? 'polite' : 'off'}>
        {value}
      </output>
      <IconButton
        label="Increase quantity"
        aria-disabled={!canIncrease}
        onClick={() => canIncrease && onChange(value + 1)}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
};
