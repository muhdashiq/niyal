import { ButtonLink } from '../../components/Button';
import { FEATURED_PERFUMES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import { ProductShowcase } from '../catalog/ProductShowcase';

export const FeaturedPerfumes = () => {
  const { t } = useLocale();

  return (
    <ProductShowcase
      title={t.home.featuredTitle}
      perfumes={FEATURED_PERFUMES}
      action={
        <ButtonLink to="/collection" variant="text">
          {t.home.featuredLink}
        </ButtonLink>
      }
    />
  );
};
