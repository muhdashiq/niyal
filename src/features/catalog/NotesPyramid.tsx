import { LOCALE } from '../../config';
import type { Perfume } from '../../types';
import styles from './NotesPyramid.module.css';

type NotesPyramidProps = {
  perfume: Pick<Perfume, 'notes' | 'accent'>;
};

const noteList = new Intl.ListFormat(LOCALE);

// Drawn in the perfume's own colour, deepening towards the base. The tiers stay pale
// enough that the darkest accent still leaves the text well above AA.
const TIERS = [
  { layer: 'top', label: 'Top', className: styles.top, tint: '26' },
  { layer: 'heart', label: 'Heart', className: styles.heart, tint: '40' },
  { layer: 'base', label: 'Base', className: styles.base, tint: '59' },
] as const;

export const NotesPyramid = ({ perfume }: NotesPyramidProps) => (
  <section className={styles.notes} aria-labelledby="notes-heading">
    <h2 id="notes-heading" className="text-h3">
      How it unfolds
    </h2>
    <p className="text-muted">
      Top notes come first, the heart follows, and the base is what stays on your skin.
    </p>
    <dl className={styles.pyramid}>
      {TIERS.map((tier) => (
        <div
          key={tier.layer}
          className={`${styles.tier} ${tier.className}`}
          style={{ backgroundColor: `${perfume.accent}${tier.tint}` }}
        >
          <dt className="text-label">{tier.label}</dt>
          <dd className={styles.tierNotes}>{noteList.format(perfume.notes[tier.layer])}</dd>
        </div>
      ))}
    </dl>
  </section>
);
