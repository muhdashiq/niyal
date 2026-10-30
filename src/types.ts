export type BottleSize = 30 | 50 | 90 | 100;

export type Perfume = {
  id: string; // slug, used in the URL
  name: string;
  tagline: string; // one evocative line
  description: string; // 2–3 sentences
  family: 'Woody' | 'Floral' | 'Oriental' | 'Fresh' | 'Gourmand' | 'Citrus';
  notes: { top: string[]; heart: string[]; base: string[] };
  concentration: 'Eau de Parfum' | 'Extrait de Parfum' | 'Attar';
  prices: Record<BottleSize, number>; // price per size, in rupees
  accent: string; // hex colour used to tint this perfume's bottle art and detail page
  image?: string; // optional path in /public/images; fall back to the generated bottle art
  featured?: boolean;
};

export type FragranceFamily = Perfume['family'];

export type CartLine = { perfumeId: string; size: BottleSize; quantity: number };
