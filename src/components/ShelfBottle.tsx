import type { ComponentProps } from 'react';
import { BottleArt } from './BottleArt';
import styles from './ShelfBottle.module.css';

export const ShelfBottle = (props: ComponentProps<typeof BottleArt>) => (
  <div className={styles.shelfBottle}>
    <BottleArt {...props} />
  </div>
);
