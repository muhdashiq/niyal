import { ButtonLink } from '../../components/Button';
import { useLocale } from '../../i18n/LocaleProvider';
import styles from './EmptyBag.module.css';

type EmptyBagProps = {
  onNavigate?: () => void;
};

export const EmptyBag = ({ onNavigate }: EmptyBagProps) => {
  const { t } = useLocale();

  return (
    <div className={styles.empty}>
      <p className="text-h3">{t.cart.emptyTitle}</p>
      <p className="text-muted">{t.cart.emptyBody}</p>
      <ButtonLink to="/collection" onClick={onNavigate}>
        {t.common.exploreCollection}
      </ButtonLink>
    </div>
  );
};
