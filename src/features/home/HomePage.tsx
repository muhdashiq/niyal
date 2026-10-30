import { BRAND_NAME } from '../../config';
import { usePageMeta } from '../../lib/usePageMeta';
import { BespokeCta } from './BespokeCta';
import { FeaturedPerfumes } from './FeaturedPerfumes';
import { Hero } from './Hero';
import { Philosophy } from './Philosophy';
import { SizeGuide } from './SizeGuide';
import { useScrollToSection } from './useScrollToSection';

export const HomePage = () => {
  useScrollToSection();
  usePageMeta({
    title: `${BRAND_NAME} | A fragrance made to understand you`,
    description:
      'Niyal makes perfume shaped around the person who wears it. Explore the collection, choose your size, and order on WhatsApp.',
  });

  return (
    <>
      <Hero />
      <Philosophy />
      <FeaturedPerfumes />
      <SizeGuide />
      <BespokeCta />
    </>
  );
};
