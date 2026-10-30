import styles from './AmbientLight.module.css';

type AmbientLightProps = {
  accent?: string;
  placement?: 'right' | 'center';
};

// A lamp and the perfume's own colour, drifting behind a bottle. The parent needs
// `position: relative` and `isolation: isolate`.
export const AmbientLight = ({ accent, placement = 'center' }: AmbientLightProps) => (
  <div aria-hidden="true" className={`${styles.ambient} ${styles[placement]}`}>
    <div className={styles.lamp} />
    {accent && (
      <div
        className={styles.tint}
        style={{ backgroundImage: `radial-gradient(closest-side, ${accent}73, transparent)` }}
      />
    )}
  </div>
);
