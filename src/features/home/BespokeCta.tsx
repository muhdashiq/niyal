import { ButtonAnchor } from '../../components/Button';
import { RevealGroup, RevealItem } from '../../components/Reveal';
import { ShelfBottle } from '../../components/ShelfBottle';
import { BRAND_NAME } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import { whatsappUrl } from '../../lib/whatsappUrl';
import styles from './BespokeCta.module.css';

const BRASS_GLASS = '#b8934f';

export const BespokeCta = () => {
  const { t } = useLocale();
  // A bottle still waiting for its perfume, so its label and brass-coloured glass name no one yet.
  const unwrittenBottle = { name: t.home.bespokeBottle, accent: BRASS_GLASS };

  return (
    <section id="bespoke" data-surface="dark" className={styles.bespoke} aria-labelledby="bespoke-heading">
      <RevealGroup className={`page-width ${styles.layout}`}>
        <RevealItem className={styles.copy}>
          <h2 id="bespoke-heading">{t.home.bespokeTitle}</h2>
          <p className="text-lead text-muted">{t.home.bespokeBody}</p>
          <ButtonAnchor
            href={whatsappUrl(t.home.bespokeGreeting(BRAND_NAME))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.common.whatsapp}
          </ButtonAnchor>
        </RevealItem>
        <RevealItem className={styles.shelf}>
          <div className={styles.bottle}>
            <ShelfBottle perfume={unwrittenBottle} size={50} decorative />
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
};
