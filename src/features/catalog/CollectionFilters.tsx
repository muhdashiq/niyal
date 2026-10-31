import { Select } from '../../components/Select';
import { FRAGRANCE_FAMILIES } from '../../data/perfumes';
import { useLocale } from '../../i18n/LocaleProvider';
import type { FragranceFamily } from '../../types';
import styles from './CollectionFilters.module.css';
import type { SortOption } from './selectPerfumes';
import { SORT_OPTIONS } from './useCollectionFilters';

type CollectionFiltersProps = {
  families: readonly FragranceFamily[];
  sort: SortOption;
  onToggleFamily: (family: FragranceFamily) => void;
  onClearFamilies: () => void;
  onChangeSort: (value: string) => void;
};

export const CollectionFilters = ({
  families,
  sort,
  onToggleFamily,
  onClearFamilies,
  onChangeSort,
}: CollectionFiltersProps) => {
  const { t } = useLocale();

  return (
    <div className={styles.filters}>
      <div role="group" aria-label={t.catalog.filterLabel} className={styles.chips}>
        <button
          type="button"
          className={styles.chip}
          aria-pressed={families.length === 0}
          onClick={onClearFamilies}
        >
          {t.catalog.all}
        </button>
        {FRAGRANCE_FAMILIES.map((family) => (
          <button
            key={family}
            type="button"
            className={styles.chip}
            aria-pressed={families.includes(family)}
            onClick={() => onToggleFamily(family)}
          >
            {t.families[family]}
          </button>
        ))}
      </div>

      <label className={styles.sort}>
        <span className="text-small text-muted">{t.catalog.sortBy}</span>
        <Select value={sort} onChange={(event) => onChangeSort(event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t.catalog.sort[option]}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
};
