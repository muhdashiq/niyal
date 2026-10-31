import { useSearchParams } from 'react-router-dom';
import { FRAGRANCE_FAMILIES } from '../../data/perfumes';
import type { FragranceFamily } from '../../types';
import type { SortOption } from './selectPerfumes';

const DEFAULT_SORT: SortOption = 'featured';

export const SORT_OPTIONS: readonly SortOption[] = ['featured', 'price-asc', 'price-desc'];

// The URL can be edited by hand, so anything it holds is checked before use.
const isFragranceFamily = (value: string): value is FragranceFamily =>
  FRAGRANCE_FAMILIES.some((family) => family === value);

const findSortOption = (value: string | null) => SORT_OPTIONS.find((option) => option === value);

export const useCollectionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const families = [...new Set(searchParams.getAll('family').filter(isFragranceFamily))];
  const sort = findSortOption(searchParams.get('sort')) ?? DEFAULT_SORT;

  const updateUrl = (nextFamilies: readonly FragranceFamily[], nextSort: SortOption) => {
    const nextParams = new URLSearchParams();
    nextFamilies.forEach((family) => nextParams.append('family', family));
    if (nextSort !== DEFAULT_SORT) nextParams.set('sort', nextSort);
    setSearchParams(nextParams, { replace: true });
  };

  const toggleFamily = (family: FragranceFamily) => {
    const isSelected = families.includes(family);
    updateUrl(isSelected ? families.filter((selected) => selected !== family) : [...families, family], sort);
  };

  const clearFamilies = () => updateUrl([], sort);

  const changeSort = (value: string) => updateUrl(families, findSortOption(value) ?? DEFAULT_SORT);

  return { families, sort, toggleFamily, clearFamilies, changeSort };
};
