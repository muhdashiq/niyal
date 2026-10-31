import { BRAND_NAME } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import { usePageMeta } from '../../lib/usePageMeta';
import { BespokeCta } from './BespokeCta';
import { FeaturedPerfumes } from './FeaturedPerfumes';
import { Hero } from './Hero';
import { Philosophy } from './Philosophy';
import { SizeGuide } from './SizeGuide';
import { useScrollToSection } from './useScrollToSection';

export const HomePage = () => {
  const { t } = useLocale();
  useScrollToSection();
  usePageMeta({
    title: `${BRAND_NAME} | ${t.home.title}`,
    description: t.home.description(BRAND_NAME),
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
