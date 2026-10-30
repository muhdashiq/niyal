import { ButtonAnchor } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { BRAND_NAME, INSTAGRAM_URL } from '../../config';
import { whatsappUrl } from '../../lib/whatsappUrl';
import styles from './Footer.module.css';

export const Footer = () => (
  <footer data-surface="dark" className={styles.footer}>
    <div className="page-width">
      <div className={styles.top}>
        <p className={`text-h2 ${styles.brandLine}`}>Fragrance shaped around the person who wears it.</p>
        <ul className={styles.links}>
          <li>
            <ButtonAnchor variant="text" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </ButtonAnchor>
          </li>
          <li>
            <ButtonAnchor variant="text" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </ButtonAnchor>
          </li>
        </ul>
      </div>
      <Divider />
      <p className={`text-small text-muted ${styles.copyright}`}>
        © {new Date().getFullYear()} {BRAND_NAME}
      </p>
    </div>
  </footer>
);
