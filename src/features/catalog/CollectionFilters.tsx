import { Select } from '../../components/Select';
import { FRAGRANCE_FAMILIES } from '../../data/perfumes';
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
}: CollectionFiltersProps) => (
  <div className={styles.filters}>
    <div role="group" aria-label="Filter by fragrance family" className={styles.chips}>
      <button
        type="button"
        className={styles.chip}
        aria-pressed={families.length === 0}
        onClick={onClearFamilies}
      >
        All
      </button>
      {FRAGRANCE_FAMILIES.map((family) => (
        <button
          key={family}
          type="button"
          className={styles.chip}
          aria-pressed={families.includes(family)}
          onClick={() => onToggleFamily(family)}
        >
          {family}
        </button>
      ))}
    </div>

    <label className={styles.sort}>
      <span className="text-small text-muted">Sort by</span>
      <Select value={sort} onChange={(event) => onChangeSort(event.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  </div>
);
