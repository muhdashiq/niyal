import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from './icons';
import styles from './Select.module.css';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, ...selectProps }, ref) => (
    <span className={styles.frame}>
      <select ref={ref} className={styles.select} {...selectProps}>
        {children}
      </select>
      <span className={styles.chevron}>
        <ChevronDownIcon />
      </span>
    </span>
  ),
);

Select.displayName = 'Select';
