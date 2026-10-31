import { ButtonAnchor } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { BRAND_NAME, INSTAGRAM_URL } from '../../config';
import { FooterPreferences } from '../../features/preferences/FooterPreferences';
import { useLocale } from '../../i18n/LocaleProvider';
import { whatsappUrl } from '../../lib/whatsappUrl';
import styles from './Footer.module.css';

export const Footer = () => {
  const { t } = useLocale();

  return (
    <footer data-surface="dark" className={styles.footer}>
      <div className="page-width">
        <div className={styles.top}>
          <p className={`text-h2 ${styles.brandLine}`}>{t.layout.footerLine}</p>
          <ul className={styles.links}>
            <li>
              <ButtonAnchor variant="text" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {t.common.whatsapp}
              </ButtonAnchor>
            </li>
            <li>
              <ButtonAnchor variant="text" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                {t.layout.instagram}
              </ButtonAnchor>
            </li>
            <li>
              <FooterPreferences />
            </li>
          </ul>
        </div>
        <Divider />
        <div className={styles.bottom}>
          <p className="text-small text-muted">{t.shipping.notice}</p>
          <p className="text-small text-muted">
            © {new Date().getFullYear()} {BRAND_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
};
