import { useLocale } from '../../i18n/LocaleProvider';
import { localisePerfume } from '../../i18n/localisePerfume';
import type { Perfume } from '../../types';
import styles from './NotesPyramid.module.css';

type NotesPyramidProps = {
  perfume: Perfume;
};

export const NotesPyramid = ({ perfume }: NotesPyramidProps) => {
  const { t, formatList } = useLocale();
  const { noteNames } = localisePerfume(perfume, t);

  // Drawn in the perfume's own colour, deepening towards the base. The tiers stay pale
  // enough that the darkest accent still leaves the text well above AA.
  const tiers = [
    { layer: 'top', label: t.catalog.notesTop, className: styles.top, tint: '26' },
    { layer: 'heart', label: t.catalog.notesHeart, className: styles.heart, tint: '40' },
    { layer: 'base', label: t.catalog.notesBase, className: styles.base, tint: '59' },
  ] as const;

  return (
    <section className={styles.notes} aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="text-h3">
        {t.catalog.notesTitle}
      </h2>
      <p className="text-muted">{t.catalog.notesBody}</p>
      <dl className={styles.pyramid}>
        {tiers.map((tier) => (
          <div
            key={tier.layer}
            className={`${styles.tier} ${tier.className}`}
            style={{ backgroundColor: `${perfume.accent}${tier.tint}` }}
          >
            <dt className="text-label">{tier.label}</dt>
            <dd className={styles.tierNotes}>{formatList(noteNames(perfume.notes[tier.layer]))}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
