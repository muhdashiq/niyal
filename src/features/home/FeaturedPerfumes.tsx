import { ButtonLink } from '../../components/Button';
import { FEATURED_PERFUMES } from '../../data/perfumes';
import { ProductShowcase } from '../catalog/ProductShowcase';

export const FeaturedPerfumes = () => (
  <ProductShowcase
    title="Where to begin"
    perfumes={FEATURED_PERFUMES}
    action={
      <ButtonLink to="/collection" variant="text">
        See the full collection
      </ButtonLink>
    }
  />
);
