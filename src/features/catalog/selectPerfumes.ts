import { BOTTLE_SIZES } from '../../data/perfumes';
import type { FragranceFamily, Perfume } from '../../types';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export const startingPrice = (perfume: Perfume) => perfume.prices[BOTTLE_SIZES[0]];

const COMPARATORS: Record<SortOption, (first: Perfume, second: Perfume) => number> = {
  featured: (first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)),
  'price-asc': (first, second) => startingPrice(first) - startingPrice(second),
  'price-desc': (first, second) => startingPrice(second) - startingPrice(first),
};

// Same family first, then the rest of the catalog to make up the count.
export const selectRelatedPerfumes = (
  perfumes: readonly Perfume[],
  current: Perfume,
  count = 3,
) => {
  const others = perfumes.filter((perfume) => perfume.id !== current.id);
  const sameFamily = others.filter((perfume) => perfume.family === current.family);
  const otherFamilies = others.filter((perfume) => perfume.family !== current.family);
  return [...sameFamily, ...otherFamilies].slice(0, count);
};

export const selectPerfumes = (
  perfumes: readonly Perfume[],
  families: readonly FragranceFamily[],
  sort: SortOption,
) =>
  perfumes
    .filter((perfume) => families.length === 0 || families.includes(perfume.family))
    .sort(COMPARATORS[sort]);
