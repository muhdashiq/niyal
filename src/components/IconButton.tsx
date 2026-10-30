import { type ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, children, ...buttonProps }, ref) => (
    <button ref={ref} type="button" aria-label={label} className={styles.iconButton} {...buttonProps}>
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';
