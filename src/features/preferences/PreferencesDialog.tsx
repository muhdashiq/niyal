import { AnimatePresence, m } from 'motion/react';
import { useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../components/icons';
import { IconButton } from '../../components/IconButton';
import { Select } from '../../components/Select';
import { CURRENCY_CODES, HOME_CURRENCY } from '../../config';
import { LANGUAGE_CODES, LANGUAGES } from '../../i18n/languages';
import { useLocale } from '../../i18n/LocaleProvider';
import { DESKTOP_QUERY } from '../../lib/breakpoints';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import { useModal } from '../../lib/useModal';
import styles from './PreferencesDialog.module.css';

type PanelProps = {
  onDismiss: () => void;
};

type PreferencesDialogProps = PanelProps & {
  isOpen: boolean;
};

const TRANSITION = { duration: DURATION.base, ease: EASE_SETTLE };

const Panel = ({ onDismiss }: PanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [hiddenState] = useState(() =>
    window.matchMedia(DESKTOP_QUERY).matches ? { opacity: 0, y: -8 } : { opacity: 1, y: '100%' },
  );
  const { t, language, currency, country, intlLocale, countries, setLanguage, setCurrency, setCountry } =
    useLocale();
  const countryOptions = useMemo(countries, [countries]);
  const currencyNames = useMemo(() => new Intl.DisplayNames(intlLocale, { type: 'currency' }), [intlLocale]);
  useModal(panelRef, onDismiss);

  const chooseLanguage = (value: string) => {
    const chosen = LANGUAGE_CODES.find((code) => code === value);
    if (chosen) setLanguage(chosen);
  };

  const chooseCurrency = (value: string) => {
    const chosen = CURRENCY_CODES.find((code) => code === value);
    if (chosen) setCurrency(chosen);
  };

  return (
    <>
      <m.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION}
        onClick={onDismiss}
      />
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-surface="light"
        className={styles.panel}
        initial={hiddenState}
        animate={{ opacity: 1, y: 0 }}
        exit={hiddenState}
        transition={TRANSITION}
      >
        <div className={styles.heading}>
          <h2 id={titleId} className="text-h3">
            {t.preferences.title}
          </h2>
          <IconButton label={t.common.close} onClick={onDismiss}>
            <CloseIcon />
          </IconButton>
        </div>

        <label className={styles.field}>
          <span className="text-small text-muted">{t.preferences.language}</span>
          <Select value={language} onChange={(event) => chooseLanguage(event.target.value)}>
            {LANGUAGE_CODES.map((code) => (
              <option key={code} value={code} lang={LANGUAGES[code].tag}>
                {LANGUAGES[code].name}
              </option>
            ))}
          </Select>
        </label>

        <label className={styles.field}>
          <span className="text-small text-muted">{t.preferences.currency}</span>
          <Select value={currency} onChange={(event) => chooseCurrency(event.target.value)}>
            {CURRENCY_CODES.map((code) => (
              <option key={code} value={code}>
                {code} – {currencyNames.of(code)}
              </option>
            ))}
          </Select>
        </label>

        <label className={styles.field}>
          <span className="text-small text-muted">{t.preferences.country}</span>
          <Select value={country} onChange={(event) => setCountry(event.target.value)}>
            {countryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </Select>
        </label>

        <div className={styles.notes}>
          <p className="text-small text-muted">{t.shipping.notice}</p>
          {currency !== HOME_CURRENCY && <p className="text-small text-muted">{t.preferences.rateNote}</p>}
        </div>
      </m.div>
    </>
  );
};

// Rendered on the body so the sticky header and dark footer can't clip or recolour it.
export const PreferencesDialog = ({ isOpen, onDismiss }: PreferencesDialogProps) =>
  createPortal(<AnimatePresence>{isOpen && <Panel onDismiss={onDismiss} />}</AnimatePresence>, document.body);
