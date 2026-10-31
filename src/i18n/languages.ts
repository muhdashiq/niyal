export const LANGUAGE_CODES = ['en', 'ar', 'ml', 'hi', 'ta', 'kn', 'ur', 'es', 'ja', 'zh'] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export type Script =
  | 'latin'
  | 'arabic'
  | 'nastaliq'
  | 'devanagari'
  | 'malayalam'
  | 'tamil'
  | 'kannada'
  | 'japanese'
  | 'chinese';

type Language = {
  name: string; // in its own script, because that's what someone looking for it can read
  englishName: string;
  tag: string; // the value of <html lang>
  intlLocale: string;
  direction: 'ltr' | 'rtl';
  script: Script;
  fonts: readonly string[]; // Google Fonts families, added only when this language is in use
  sizeDisplay: 'short' | 'long'; // long where the short form of ml falls back to Latin letters
};

// nu-latn keeps prices in Western digits in Arabic and Urdu, which is what Gulf and Pakistani
// shops print and what customers will compare against.
export const LANGUAGES: Record<LanguageCode, Language> = {
  en: {
    name: 'English',
    englishName: 'English',
    tag: 'en',
    intlLocale: 'en-IN',
    direction: 'ltr',
    script: 'latin',
    fonts: [],
    sizeDisplay: 'short',
  },
  ar: {
    name: 'العربية',
    englishName: 'Arabic',
    tag: 'ar',
    intlLocale: 'ar-u-nu-latn',
    direction: 'rtl',
    script: 'arabic',
    fonts: ['Noto+Naskh+Arabic:wght@400..700', 'Noto+Sans+Arabic:wght@400..700'],
    sizeDisplay: 'short',
  },
  ml: {
    name: 'മലയാളം',
    englishName: 'Malayalam',
    tag: 'ml',
    intlLocale: 'ml-IN',
    direction: 'ltr',
    script: 'malayalam',
    fonts: ['Noto+Serif+Malayalam:wght@300..700', 'Noto+Sans+Malayalam:wght@400..700'],
    sizeDisplay: 'short',
  },
  hi: {
    name: 'हिन्दी',
    englishName: 'Hindi',
    tag: 'hi',
    intlLocale: 'hi-IN',
    direction: 'ltr',
    script: 'devanagari',
    fonts: ['Noto+Serif+Devanagari:wght@300..700', 'Noto+Sans+Devanagari:wght@400..700'],
    sizeDisplay: 'short',
  },
  ta: {
    name: 'தமிழ்',
    englishName: 'Tamil',
    tag: 'ta',
    intlLocale: 'ta-IN',
    direction: 'ltr',
    script: 'tamil',
    fonts: ['Noto+Serif+Tamil:wght@300..700', 'Noto+Sans+Tamil:wght@400..700'],
    sizeDisplay: 'short',
  },
  kn: {
    name: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    tag: 'kn',
    intlLocale: 'kn-IN',
    direction: 'ltr',
    script: 'kannada',
    fonts: ['Noto+Serif+Kannada:wght@300..700', 'Noto+Sans+Kannada:wght@400..700'],
    sizeDisplay: 'short',
  },
  ur: {
    name: 'اردو',
    englishName: 'Urdu',
    tag: 'ur',
    intlLocale: 'ur-u-nu-latn',
    direction: 'rtl',
    script: 'nastaliq',
    fonts: ['Noto+Nastaliq+Urdu:wght@400..700'],
    sizeDisplay: 'long',
  },
  es: {
    name: 'Español',
    englishName: 'Spanish',
    tag: 'es',
    intlLocale: 'es',
    direction: 'ltr',
    script: 'latin',
    fonts: [],
    sizeDisplay: 'short',
  },
  ja: {
    name: '日本語',
    englishName: 'Japanese',
    tag: 'ja',
    intlLocale: 'ja',
    direction: 'ltr',
    script: 'japanese',
    fonts: ['Noto+Serif+JP:wght@300..700', 'Noto+Sans+JP:wght@400..700'],
    sizeDisplay: 'short',
  },
  zh: {
    name: '简体中文',
    englishName: 'Chinese (Simplified)',
    tag: 'zh-Hans',
    intlLocale: 'zh-CN',
    direction: 'ltr',
    script: 'chinese',
    fonts: ['Noto+Serif+SC:wght@300..700', 'Noto+Sans+SC:wght@400..700'],
    sizeDisplay: 'short',
  },
};
