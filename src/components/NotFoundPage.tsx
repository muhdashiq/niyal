import { usePageMeta } from '../lib/usePageMeta';
import { ButtonLink } from './Button';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  usePageMeta({
    title: 'Page not found',
    description: 'This page is not on the Niyal site. The full collection is one click away.',
  });

  return (
    <div className={styles.page}>
      <h1>This page isn't here</h1>
      <p className="text-lead text-muted">
        The link may be old, or the perfume may have left the collection.
      </p>
      <ButtonLink to="/collection">Back to the collection</ButtonLink>
    </div>
  );
};
