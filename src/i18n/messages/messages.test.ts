import { describe, expect, it } from 'vitest';
import { LANGUAGE_CODES, LANGUAGES, type LanguageCode } from '../languages';
import { ar } from './ar';
import { en, type Messages } from './en';
import { es } from './es';
import { hi } from './hi';
import { ja } from './ja';
import { kn } from './kn';
import { ml } from './ml';
import { ta } from './ta';
import { ur } from './ur';
import { zh } from './zh';

const ALL: Record<LanguageCode, Messages> = { en, ar, ml, hi, ta, kn, ur, es, ja, zh };

const SAMPLE_ARGUMENTS = ['AAA', 'BBB', 'CCC'];

// Walks a dictionary and hands back every text it holds, with its path for the failure message.
const collectTexts = (node: unknown, path: string): { path: string; text: string; args: number }[] => {
  if (typeof node === 'string') return [{ path, text: node, args: 0 }];
  if (typeof node === 'function') {
    return [{ path, text: String(node(...SAMPLE_ARGUMENTS)), args: node.length }];
  }
  if (typeof node === 'object' && node !== null) {
    return Object.entries(node).flatMap(([key, value]) => collectTexts(value, `${path}.${key}`));
  }
  return [];
};

const NUMERIC_MESSAGES = ['catalog.count', 'cart.itemCount', 'cart.limit'];

describe.each(LANGUAGE_CODES)('%s', (code) => {
  const texts = collectTexts(ALL[code], code);

  it('has no empty text, apart from the half of "from" a language does not use', () => {
    const empty = texts.filter(({ text, path }) => text.trim() === '' && !/\.from(Before|After)$/.test(path));
    expect(empty.map(({ path }) => path)).toEqual([]);
  });

  it('puts every value it is given into the sentence', () => {
    const lost = texts.flatMap(({ path, text, args }) => {
      if (NUMERIC_MESSAGES.some((name) => path.endsWith(name))) return [];
      return SAMPLE_ARGUMENTS.slice(0, args).filter((value) => !text.includes(value)).map((value) => `${path}: ${value}`);
    });
    expect(lost).toEqual([]);
  });

  it('counts from one to a hundred and more', () => {
    for (const count of [0, 1, 2, 3, 11, 100, 101]) {
      expect(ALL[code].catalog.count(count)).not.toBe('');
      expect(ALL[code].cart.itemCount(count)).not.toBe('');
    }
  });

  it('has the shipping notice the brand asked for', () => {
    expect(ALL[code].shipping.notice.length).toBeGreaterThan(10);
  });

  it('is declared with a language name', () => {
    expect(LANGUAGES[code].name).not.toBe('');
  });
});

describe('translations of the catalog', () => {
  const PERFUME_IDS = Object.keys(es.perfumes);
  const NOTE_NAMES = Object.keys(es.notes);

  it.each(LANGUAGE_CODES.filter((code) => code !== 'en'))('%s covers the same perfumes and notes', (code) => {
    expect(Object.keys(ALL[code].perfumes).sort()).toEqual([...PERFUME_IDS].sort());
    expect(Object.keys(ALL[code].notes).sort()).toEqual([...NOTE_NAMES].sort());
  });
});

describe('Arabic plurals', () => {
  it('uses the right form for each count', () => {
    expect(ar.cart.itemCount(1)).toBe('منتج واحد');
    expect(ar.cart.itemCount(2)).toBe('منتجان');
    expect(ar.cart.itemCount(3)).toBe('3 منتجات');
    expect(ar.cart.itemCount(11)).toBe('11 منتجًا');
    expect(ar.cart.itemCount(100)).toBe('100 منتج');
  });
});
