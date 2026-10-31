import { useRef, useState } from 'react';
import { LANGUAGES } from '../../i18n/languages';
import { useLocale } from '../../i18n/LocaleProvider';

export const usePreferencesDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t, language, currency, country, nameOfCountry } = useLocale();
  const languageName = LANGUAGES[language].name;

  const open = () => setIsOpen(true);

  const dismiss = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return {
    isOpen,
    open,
    dismiss,
    triggerRef,
    languageName,
    currency,
    summary: t.preferences.summary(languageName, currency, nameOfCountry(country)),
  };
};
