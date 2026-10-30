import styles from './Divider.module.css';

type DividerTone = 'quiet' | 'accent';

type DividerProps = {
  tone?: DividerTone;
};

export const Divider = ({ tone = 'quiet' }: DividerProps) => (
  <hr className={`${styles.divider} ${styles[tone]}`} />
);
