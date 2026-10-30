import type { ReactNode } from 'react';
import { BottleIcon, ComposeIcon, ListenIcon } from '../../components/icons';
import { RevealGroup, RevealItem, RevealListItem } from '../../components/Reveal';
import styles from './Philosophy.module.css';

type Beat = {
  name: string;
  icon: ReactNode;
  text: string;
};

const BEATS: readonly Beat[] = [
  {
    name: 'Listen',
    icon: <ListenIcon />,
    text: 'Tell us what you wear now, what you avoid, and where you want to wear it.',
  },
  {
    name: 'Compose',
    icon: <ComposeIcon />,
    text: 'We build the notes around your answers, then adjust the balance until it suits you.',
  },
  {
    name: 'Bottle',
    icon: <BottleIcon />,
    text: 'Your fragrance goes into the size you choose and comes to your door.',
  },
];

export const Philosophy = () => (
  <section id="story" data-surface="light" className={styles.philosophy} aria-labelledby="story-heading">
    <RevealGroup className="page-width">
      <RevealItem>
        <h2 id="story-heading" className={styles.motto}>
          First we understand you. Then we make the fragrance.
        </h2>
      </RevealItem>
      <ol className={styles.beats}>
        {BEATS.map((beat) => (
          <RevealListItem key={beat.name} className={styles.beat}>
            <div className={styles.iconShelf}>{beat.icon}</div>
            <h3>{beat.name}</h3>
            <p className="text-muted">{beat.text}</p>
          </RevealListItem>
        ))}
      </ol>
    </RevealGroup>
  </section>
);
