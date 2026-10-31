import { type CurrencyCode, CURRENCY_CODES, HOME_COUNTRY } from '../config';
import { readStorage, writeStorage } from '../lib/storage';
import { isCountryCode } from './countries';
import { LANGUAGE_CODES, type LanguageCode } from './languages';

export const SETTINGS_KEY = 'niyal.settings.v1';

export type LocaleSettings = {
  language: LanguageCode;
  currency: CurrencyCode;
  country: string;
};

// Named exactly, because the zone tells apart what a browser language can't: plenty of phones
// in Kerala and Dubai run in en-US.
const TIME_ZONE_COUNTRIES: Readonly<Record<string, string>> = {
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Muscat': 'OM',
  'Asia/Bahrain': 'BH',
  'Asia/Kuwait': 'KW',
  'Asia/Qatar': 'QA',
  'Europe/London': 'GB',
};

const EURO_COUNTRIES = 'AT BE BG CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK'.split(' ');

const NATIONAL_CURRENCIES: Readonly<Record<string, CurrencyCode>> = {
  IN: 'INR',
  AE: 'AED',
  SA: 'SAR',
  OM: 'OMR',
  BH: 'BHD',
  KW: 'KWD',
  QA: 'QAR',
  GB: 'GBP',
};

const OTHER_COUNTRY_CURRENCY: CurrencyCode = 'USD';

export const currencyForCountry = (country: string): CurrencyCode => {
  if (EURO_COUNTRIES.includes(country)) return 'EUR';
  return NATIONAL_CURRENCIES[country] ?? OTHER_COUNTRY_CURRENCY;
};

const isLanguageCode = (value: unknown): value is LanguageCode =>
  LANGUAGE_CODES.some((code) => code === value);

const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  CURRENCY_CODES.some((code) => code === value);

export const detectLanguage = (browserLanguages: readonly string[]): LanguageCode => {
  for (const tag of browserLanguages) {
    const base = tag.split('-')[0]?.toLowerCase();
    if (isLanguageCode(base)) return base;
  }
  return 'en';
};

const regionOf = (tag: string) => tag.split('-').find((part) => /^[A-Z]{2}$/.test(part));

export const detectCountry = (timeZone: string, browserLanguages: readonly string[]) => {
  const fromZone = TIME_ZONE_COUNTRIES[timeZone];
  if (fromZone) return fromZone;
  const fromLanguage = browserLanguages.flatMap((tag) => regionOf(tag) ?? []).find(isCountryCode);
  return fromLanguage ?? HOME_COUNTRY;
};

export const detectSettings = (timeZone: string, browserLanguages: readonly string[]): LocaleSettings => {
  const country = detectCountry(timeZone, browserLanguages);
  return {
    language: detectLanguage(browserLanguages),
    currency: currencyForCountry(country),
    country,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parseStoredSettings = (stored: unknown, detected: LocaleSettings): LocaleSettings => {
  const record = isRecord(stored) ? stored : {};
  const { language, currency, country } = record;
  return {
    language: isLanguageCode(language) ? language : detected.language,
    currency: isCurrencyCode(currency) ? currency : detected.currency,
    country: typeof country === 'string' && isCountryCode(country) ? country : detected.country,
  };
};

export const loadSettings = () =>
  parseStoredSettings(
    readStorage(SETTINGS_KEY),
    detectSettings(Intl.DateTimeFormat().resolvedOptions().timeZone, navigator.languages),
  );

// Written only when someone makes a choice, so until then a new visit detects afresh.
export const saveSettings = (settings: LocaleSettings) => writeStorage(SETTINGS_KEY, settings);
