import { Button } from '../../components/Button';
import { BRAND_NAME } from '../../config';
import { BOTTLE_SIZES, PERFUMES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import { usePageMeta } from '../../lib/usePageMeta';
import { CollectionFilters } from './CollectionFilters';
import styles from './CollectionPage.module.css';
import { ProductCard } from './ProductCard';
import { selectPerfumes } from './selectPerfumes';
import { useCollectionFilters } from './useCollectionFilters';

export const CollectionPage = () => {
  const { t, formatList } = useLocale();
  const { families, sort, toggleFamily, clearFamilies, changeSort } = useCollectionFilters();
  const perfumes = selectPerfumes(PERFUMES, families, sort);
  const sizeList = formatList(BOTTLE_SIZES.map(String));
  usePageMeta({
    title: t.catalog.title,
    description: t.catalog.description(BRAND_NAME, sizeList),
  });

  return (
    <div className={`page-width ${styles.page}`}>
      <header className={styles.intro}>
        <h1>{t.catalog.title}</h1>
        <p className="text-lead text-muted">{t.catalog.intro(sizeList)}</p>
      </header>

      <CollectionFilters
        families={families}
        sort={sort}
        onToggleFamily={toggleFamily}
        onClearFamilies={clearFamilies}
        onChangeSort={changeSort}
      />

      <p role="status" className={`text-small text-muted ${styles.count}`}>
        {t.catalog.count(perfumes.length)}
      </p>

      <h2 className="visually-hidden">{t.catalog.perfumesHeading}</h2>
      {perfumes.length > 0 ? (
        <ul className={styles.grid}>
          {perfumes.map((perfume) => (
            <li key={perfume.id}>
              <ProductCard perfume={perfume} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className="text-h3">{t.catalog.emptyTitle}</p>
          <p className="text-muted">{t.catalog.emptyBody}</p>
          <Button variant="ghost" onClick={clearFamilies}>
            {t.catalog.clearFilters}
          </Button>
        </div>
      )}
    </div>
  );
};
