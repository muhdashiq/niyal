import { Button } from '../../components/Button';
import { LOCALE } from '../../config';
import { BOTTLE_SIZES, PERFUMES } from '../../data/perfumes';
import { usePageMeta } from '../../lib/usePageMeta';
import { CollectionFilters } from './CollectionFilters';
import styles from './CollectionPage.module.css';
import { ProductCard } from './ProductCard';
import { selectPerfumes } from './selectPerfumes';
import { useCollectionFilters } from './useCollectionFilters';

const SIZE_LIST = new Intl.ListFormat(LOCALE).format(BOTTLE_SIZES.map(String));

const describeCount = (count: number) => `${count} ${count === 1 ? 'perfume' : 'perfumes'}`;

export const CollectionPage = () => {
  const { families, sort, toggleFamily, clearFamilies, changeSort } = useCollectionFilters();
  const perfumes = selectPerfumes(PERFUMES, families, sort);
  usePageMeta({
    title: 'The collection',
    description: `Browse the Niyal perfume collection, in ${SIZE_LIST} ml bottles. Filter by fragrance family and sort by price.`,
  });

  return (
    <div className={`page-width ${styles.page}`}>
      <header className={styles.intro}>
        <h1>The collection</h1>
        <p className="text-lead text-muted">
          Every perfume comes in {SIZE_LIST} ml. Prices shown are for the smallest bottle.
        </p>
      </header>

      <CollectionFilters
        families={families}
        sort={sort}
        onToggleFamily={toggleFamily}
        onClearFamilies={clearFamilies}
        onChangeSort={changeSort}
      />

      <p role="status" className={`text-small text-muted ${styles.count}`}>
        {describeCount(perfumes.length)}
      </p>

      <h2 className="visually-hidden">Perfumes</h2>
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
          <p className="text-h3">No perfumes in these families yet</p>
          <p className="text-muted">Clear the filters to see the whole collection.</p>
          <Button variant="ghost" onClick={clearFamilies}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};
