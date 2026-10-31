import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CurrencyCode } from '../config';
import { formatMoney, type Money, moneyFromRupees } from '../lib/money';
import { readStorage } from '../lib/storage';
import { countryName, sortedCountries } from './countries';
import { LANGUAGES, type LanguageCode } from './languages';
import { applyLanguageToDocument, loadMessages } from './loadMessages';
import type { Messages } from './messages/en';
import { type LocaleSettings, parseStoredSettings, saveSettings, SETTINGS_KEY } from './settings';

type LocaleValue = LocaleSettings & {
  t: Messages;
  intlLocale: string;
  isRightToLeft: boolean;
  setLanguage: (language: LanguageCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setCountry: (country: string) => void;
  price: (rupees: number) => Money;
  formatPrice: (money: Money) => string;
  formatSize: (millilitres: number) => string;
  formatList: (items: readonly string[]) => string;
  nameOfCountry: (code: string) => string;
  countries: () => readonly { code: string; name: string }[];
};

type LocaleProviderProps = {
  initialSettings: LocaleSettings;
  initialMessages: Messages;
  children: ReactNode;
};

const LocaleContext = createContext<LocaleValue | null>(null);

export const LocaleProvider = ({ initialSettings, initialMessages, children }: LocaleProviderProps) => {
  const [settings, setSettings] = useState(initialSettings);
  const [messages, setMessages] = useState(initialMessages);
  const requestedLanguage = useRef(initialSettings.language);

  const updateSettings = useCallback((change: Partial<LocaleSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...change };
      saveSettings(next);
      return next;
    });
  }, []);

  // The page stays in the old language until the new one has arrived. If it never does, the
  // visitor keeps a working page in the language they had.
  const showLanguage = useCallback((language: LanguageCode) => {
    requestedLanguage.current = language;
    return loadMessages(language).then((loaded) => {
      if (requestedLanguage.current !== language) return false;
      applyLanguageToDocument(language);
      setMessages(loaded);
      return true;
    });
  }, []);

  const setLanguage = useCallback(
    (language: LanguageCode) => {
      showLanguage(language)
        .then((isShowing) => {
          if (isShowing) updateSettings({ language });
        })
        .catch(() => undefined);
    },
    [showLanguage, updateSettings],
  );

  const setCurrency = useCallback((currency: CurrencyCode) => updateSettings({ currency }), [updateSettings]);

  const setCountry = useCallback((country: string) => updateSettings({ country }), [updateSettings]);

  useEffect(() => {
    const syncFromOtherTab = (event: StorageEvent) => {
      if (event.key !== SETTINGS_KEY) return;
      const next = parseStoredSettings(readStorage(SETTINGS_KEY), initialSettings);
      setSettings(next);
      showLanguage(next.language).catch(() => undefined);
    };
    window.addEventListener('storage', syncFromOtherTab);
    return () => window.removeEventListener('storage', syncFromOtherTab);
  }, [initialSettings, showLanguage]);

  const value = useMemo<LocaleValue>(() => {
    const { intlLocale, direction, sizeDisplay } = LANGUAGES[settings.language];
    const sizeFormat = new Intl.NumberFormat(intlLocale, {
      style: 'unit',
      unit: 'milliliter',
      unitDisplay: sizeDisplay,
    });
    const listFormat = new Intl.ListFormat(intlLocale);

    return {
      ...settings,
      t: messages,
      intlLocale,
      isRightToLeft: direction === 'rtl',
      setLanguage,
      setCurrency,
      setCountry,
      price: (rupees) => moneyFromRupees(rupees, settings.currency),
      formatPrice: (money) => formatMoney(money, intlLocale),
      formatSize: (millilitres) => sizeFormat.format(millilitres),
      formatList: (items) => listFormat.format(items),
      nameOfCountry: (code) => countryName(code, intlLocale),
      countries: () => sortedCountries(intlLocale),
    };
  }, [settings, messages, setLanguage, setCurrency, setCountry]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error('useLocale must be used inside LocaleProvider');
  return locale;
};
