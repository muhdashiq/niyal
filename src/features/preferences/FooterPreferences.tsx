import { Button } from '../../components/Button';
import { useLocale } from '../../i18n/LocaleProvider';
import { PreferencesDialog } from './PreferencesDialog';
import { usePreferencesDialog } from './usePreferencesDialog';

export const FooterPreferences = () => {
  const { t } = useLocale();
  const { isOpen, open, dismiss, triggerRef, languageName, currency, summary } = usePreferencesDialog();

  return (
    <>
      <Button ref={triggerRef} variant="text" aria-label={summary} aria-haspopup="dialog" onClick={open}>
        {t.common.lineName(languageName, currency)}
      </Button>
      <PreferencesDialog isOpen={isOpen} onDismiss={dismiss} />
    </>
  );
};
