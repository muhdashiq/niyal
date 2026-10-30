import { AmbientLight } from '../../components/AmbientLight';
import { ButtonLink } from '../../components/Button';
import { ShelfBottle } from '../../components/ShelfBottle';
import { FEATURED_PERFUMES } from '../../data/perfumes';
import styles from './Hero.module.css';

const HERO_PERFUME = FEATURED_PERFUMES[0];

export const Hero = () => (
  <section data-surface="dark" className={styles.hero}>
    <AmbientLight accent={HERO_PERFUME?.accent} placement="right" />

    <div className={styles.shelf}>
      <div className={`page-width ${styles.stage}`}>
        <div className={styles.copy}>
          <h1 className="text-display">A fragrance made to understand you</h1>
          <p className="text-lead text-muted">
            We listen first, then compose around the person who will wear it.
          </p>
          <div className={styles.actions}>
            <ButtonLink to="/collection">Explore the collection</ButtonLink>
            <ButtonLink to="/?section=bespoke" variant="ghost">
              Create your signature
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
