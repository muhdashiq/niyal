import { LANGUAGES, type LanguageCode } from './languages';
import { en, type Messages } from './messages/en';

// English ships in the main bundle as the fallback. Each other language downloads when chosen.
const LOADERS: Record<Exclude<LanguageCode, 'en'>, () => Promise<Messages>> = {
  ar: () => import('./messages/ar').then((module) => module.ar),
  ml: () => import('./messages/ml').then((module) => module.ml),
  hi: () => import('./messages/hi').then((module) => module.hi),
  ta: () => import('./messages/ta').then((module) => module.ta),
  kn: () => import('./messages/kn').then((module) => module.kn),
  ur: () => import('./messages/ur').then((module) => module.ur),
  es: () => import('./messages/es').then((module) => module.es),
  ja: () => import('./messages/ja').then((module) => module.ja),
  zh: () => import('./messages/zh').then((module) => module.zh),
};

export const loadMessages = (language: LanguageCode): Promise<Messages> =>
  language === 'en' ? Promise.resolve(en) : LOADERS[language]();

const loadFonts = (language: LanguageCode) => {
  const { fonts } = LANGUAGES[language];
  if (fonts.length === 0) return;
  if (document.querySelector(`link[data-fonts-for="${language}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fonts.map((font) => `family=${font}`).join('&')}&display=swap`;
  link.dataset.fontsFor = language;
  document.head.append(link);
};

export const applyLanguageToDocument = (language: LanguageCode) => {
  const { tag, direction, script } = LANGUAGES[language];
  const root = document.documentElement;
  root.lang = tag;
  root.dir = direction;
  root.dataset.script = script;
  loadFonts(language);
};
