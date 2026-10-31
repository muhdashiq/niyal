import { BRAND_NAME } from '../config';
import { useLocale } from '../i18n/LocaleProvider';
import { usePageMeta } from '../lib/usePageMeta';
import { ButtonLink } from './Button';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  const { t } = useLocale();
  usePageMeta({
    title: t.notFound.metaTitle,
    description: t.notFound.description(BRAND_NAME),
  });

  return (
    <div className={styles.page}>
      <h1>{t.notFound.title}</h1>
      <p className="text-lead text-muted">{t.notFound.body}</p>
      <ButtonLink to="/collection">{t.notFound.back}</ButtonLink>
    </div>
  );
};
