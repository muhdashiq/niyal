import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import styles from './Wordmark.module.css';

export const Wordmark = () => {
  const { t } = useLocale();

  return (
    <Link to="/" aria-label={t.layout.homeLink(BRAND_NAME)} className={`text-wordmark ${styles.wordmark}`}>
      {BRAND_NAME}
    </Link>
  );
};
