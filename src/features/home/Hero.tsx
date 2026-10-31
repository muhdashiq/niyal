import { AmbientLight } from '../../components/AmbientLight';
import { ButtonLink } from '../../components/Button';
import { ShelfBottle } from '../../components/ShelfBottle';
import { FEATURED_PERFUMES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import styles from './Hero.module.css';

const HERO_PERFUME = FEATURED_PERFUMES[0];

export const Hero = () => {
  const { t } = useLocale();

  return (
    <section data-surface="dark" className={styles.hero}>
      <AmbientLight accent={HERO_PERFUME?.accent} placement="right" />

      <div className={styles.shelf}>
        <div className={`page-width ${styles.stage}`}>
          <div className={styles.copy}>
            <h1 className="text-display">{t.home.title}</h1>
            <p className="text-lead text-muted">{t.home.lead}</p>
            <div className={styles.actions}>
              <ButtonLink to="/collection">{t.common.exploreCollection}</ButtonLink>
              <ButtonLink to="/?section=bespoke" variant="ghost">
                {t.home.signature}
              </ButtonLink>
            </div>
          </div>
          {HERO_PERFUME && (
            <div className={styles.bottle}>
              <ShelfBottle perfume={HERO_PERFUME} size={100} priority />
            </div>
          )}
        </div>
      </div>
      <div aria-hidden="true" className={styles.ledge} />
    </section>
  );
};
