import { ButtonAnchor } from '../../components/Button';
import { RevealGroup, RevealItem } from '../../components/Reveal';
import { ShelfBottle } from '../../components/ShelfBottle';
import { BRAND_NAME } from '../../config';
import { whatsappUrl } from '../../lib/whatsappUrl';
import styles from './BespokeCta.module.css';

const GREETING = `Hello ${BRAND_NAME}, I would like to talk about a custom fragrance.`;

// A bottle still waiting for its perfume, so its label and brass-coloured glass name no one yet.
const UNWRITTEN_BOTTLE = { name: 'Yours', accent: '#b8934f' };

export const BespokeCta = () => (
  <section id="bespoke" data-surface="dark" className={styles.bespoke} aria-labelledby="bespoke-heading">
    <RevealGroup className={`page-width ${styles.layout}`}>
      <RevealItem className={styles.copy}>
        <h2 id="bespoke-heading">Ask for something that is only yours</h2>
        <p className="text-lead text-muted">
          Tell us what you love, what you avoid and who it is for. We talk it through on WhatsApp and
          compose from there.
        </p>
        <ButtonAnchor href={whatsappUrl(GREETING)} target="_blank" rel="noopener noreferrer">
          Message us on WhatsApp
        </ButtonAnchor>
      </RevealItem>
      <RevealItem className={styles.shelf}>
        <div className={styles.bottle}>
          <ShelfBottle perfume={UNWRITTEN_BOTTLE} size={50} decorative />
        </div>
      </RevealItem>
    </RevealGroup>
  </section>
);
