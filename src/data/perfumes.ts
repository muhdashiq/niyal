import type { BottleSize, FragranceFamily, Perfume } from '../types';

export const BOTTLE_SIZES = [30, 50, 90, 100] as const satisfies readonly BottleSize[];

export const DEFAULT_BOTTLE_SIZE: BottleSize = 50;

export const FRAGRANCE_FAMILIES = [
  'Woody',
  'Floral',
  'Oriental',
  'Fresh',
  'Gourmand',
  'Citrus',
] as const satisfies readonly FragranceFamily[];

export const PERFUMES: readonly Perfume[] = [
  {
    id: 'oud-noir',
    name: 'Oud Noir',
    tagline: 'Smoke and resin, warmed on skin.',
    description:
      'Dark oud opens with a crack of black pepper, then slows into frankincense and worn leather. It stays close for the first hour and turns softer and sweeter by evening. Wear it on cool nights, when someone has to lean in to catch it.',
    family: 'Woody',
    notes: {
      top: ['Black pepper', 'Elemi'],
      heart: ['Oud', 'Frankincense'],
      base: ['Leather', 'Sandalwood', 'Labdanum'],
    },
    concentration: 'Extrait de Parfum',
    prices: { 30: 2100, 50: 3200, 90: 5300, 100: 5700 },
    accent: '#7a2f3b',
    featured: true,
  },
  {
    id: 'rose-atelier',
    name: 'Rose Atelier',
    tagline: 'A rose cut at dawn and kept close all day.',
    description:
      'Damask rose with the dew still on it, and a little pink pepper to keep it awake. Geranium gives the petals a green edge. Sandalwood and musk take over after an hour, and by then it smells more like warm skin than flowers.',
    family: 'Floral',
    notes: {
      top: ['Pink pepper', 'Lychee'],
      heart: ['Damask rose', 'Geranium'],
      base: ['Sandalwood', 'White musk'],
    },
    concentration: 'Eau de Parfum',
    prices: { 30: 1800, 50: 2800, 90: 4600, 100: 4900 },
    accent: '#c4566b',
    featured: true,
  },
  {
    id: 'summer-khus',
    name: 'Summer Khus',
    tagline: 'Cool water through vetiver blinds on a hot afternoon.',
    description:
      'Before air conditioning, houses hung wet khus screens in their windows, and the breeze came through green and cold. This perfume chases that breeze with crushed lime and spearmint over clean, rooty vetiver. It holds up in full heat.',
    family: 'Fresh',
    notes: {
      top: ['Lime', 'Spearmint'],
      heart: ['Vetiver', 'Violet leaf'],
      base: ['Cedarwood', 'White musk'],
    },
    concentration: 'Eau de Parfum',
    prices: { 30: 1500, 50: 2350, 90: 3900, 100: 4200 },
    accent: '#4e7f5e',
    featured: true,
  },
  {
    id: 'mitti',
    name: 'Mitti',
    tagline: 'The first rain on dry earth.',
    description:
      'An attar built around the smell of baked clay after a summer shower. Vetiver and cypriol keep it dark and rooted, and a trace of sandalwood rounds off the edges. It is an oil, so it wears close to the skin and stays for hours.',
    family: 'Woody',
    notes: {
      top: ['Petrichor accord', 'Ginger'],
      heart: ['Baked clay', 'Vetiver'],
      base: ['Cypriol', 'Sandalwood'],
    },
    concentration: 'Attar',
    prices: { 30: 2400, 50: 3700, 90: 6100, 100: 6600 },
    accent: '#9a6b45',
  },
  {
    id: 'mogra-nights',
    name: 'Mogra Nights',
    tagline: 'Jasmine in the hair, long after sundown.',
    description:
      'Jasmine sambac in full bloom, creamy and slightly wild, the way a mogra garland smells at the end of a warm evening. Tuberose deepens it and coconut milk keeps it soft. It starts loud and ends up close and easy.',
    family: 'Floral',
    notes: {
      top: ['Mandarin', 'Green leaves'],
      heart: ['Jasmine sambac', 'Tuberose'],
      base: ['Coconut milk', 'Benzoin', 'Musk'],
    },
    concentration: 'Eau de Parfum',
    prices: { 30: 1700, 50: 2650, 90: 4300, 100: 4600 },
    accent: '#bdb66a',
  },
  {
    id: 'kesar-amber',
    name: 'Kesar Amber',
    tagline: 'Saffron threads melting into warm amber.',
    description:
      'Saffron and rose open rich and a little metallic, then sink into amber, benzoin and a thread of smoke. Wear it to weddings, winter nights and long dinners. One spray is enough.',
    family: 'Oriental',
    notes: {
      top: ['Saffron', 'Clove'],
      heart: ['Rose absolute', 'Incense'],
      base: ['Amber', 'Benzoin', 'Vanilla'],
    },
    concentration: 'Extrait de Parfum',
    prices: { 30: 2300, 50: 3500, 90: 5800, 100: 6300 },
    accent: '#c2571a',
  },
  {
    id: 'kaapi',
    name: 'Kaapi',
    tagline: 'Filter coffee, cardamom and a spoon of jaggery.',
    description:
      'A South Indian kitchen at seven in the morning, with dark roast coffee, crushed cardamom and jaggery starting to melt. Tonka and vanilla soften it as it dries. It comforts without turning into dessert.',
    family: 'Gourmand',
    notes: {
      top: ['Green cardamom', 'Bergamot'],
      heart: ['Dark roast coffee', 'Jaggery'],
      base: ['Tonka bean', 'Vanilla', 'Cedarwood'],
    },
    concentration: 'Eau de Parfum',
    prices: { 30: 1600, 50: 2500, 90: 4100, 100: 4400 },
    accent: '#6b4226',
  },
  {
    id: 'verandah',
    name: 'Verandah',
    tagline: 'Orange peel on a shaded verandah at noon.',
    description:
      'Sweet orange and bitter bergamot, with neroli drifting in behind them. Cedar and clean musk keep it dry and crisp, never sugary. Reach for this one on busy mornings.',
    family: 'Citrus',
    notes: {
      top: ['Sweet orange', 'Bergamot'],
      heart: ['Neroli', 'Petitgrain'],
      base: ['Cedarwood', 'White musk'],
    },
    concentration: 'Eau de Parfum',
    prices: { 30: 1400, 50: 2200, 90: 3600, 100: 3900 },
    accent: '#dfa21e',
  },
];

export const FEATURED_PERFUMES = PERFUMES.filter((perfume) => perfume.featured).slice(0, 3);
