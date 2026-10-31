import { BottleIcon, ComposeIcon, ListenIcon } from '../../components/icons';
import { RevealGroup, RevealItem, RevealListItem } from '../../components/Reveal';
import { useLocale } from '../../i18n/LocaleProvider';
import styles from './Philosophy.module.css';

export const Philosophy = () => {
  const { t } = useLocale();
  const beats = [
    { name: t.home.listen, icon: <ListenIcon />, text: t.home.listenText },
    { name: t.home.compose, icon: <ComposeIcon />, text: t.home.composeText },
    { name: t.home.bottle, icon: <BottleIcon />, text: t.home.bottleText },
  ];

  return (
    <section id="story" data-surface="light" className={styles.philosophy} aria-labelledby="story-heading">
      <RevealGroup className="page-width">
        <RevealItem>
          <h2 id="story-heading" className={styles.motto}>
            {t.home.motto}
          </h2>
        </RevealItem>
        <ol className={styles.beats}>
          {beats.map((beat) => (
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
};
