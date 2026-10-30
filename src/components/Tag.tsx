import type { ReactNode } from 'react';
import styles from './Tag.module.css';

type TagProps = {
  children: ReactNode;
};

export const Tag = ({ children }: TagProps) => (
  <span className={`text-label ${styles.tag}`}>{children}</span>
);
