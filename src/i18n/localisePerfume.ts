import type { Perfume } from '../types';
import type { Messages } from './messages/en';

// perfumes.ts holds the English. A perfume or note with no translation yet shows in English,
// so adding a new product never breaks a page. Perfume names stay as they are on the bottle.
export const localisePerfume = (perfume: Perfume, t: Messages) => {
  const copy = t.perfumes[perfume.id];
  return {
    tagline: copy?.tagline ?? perfume.tagline,
    description: copy?.description ?? perfume.description,
    family: t.families[perfume.family],
    concentration: t.concentrations[perfume.concentration],
    noteNames: (notes: readonly string[]) => notes.map((note) => t.notes[note] ?? note),
  };
};
