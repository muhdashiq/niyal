import { GlobeIcon } from '../../components/icons';
import styles from './HeaderPreferences.module.css';
import { PreferencesDialog } from './PreferencesDialog';
import { usePreferencesDialog } from './usePreferencesDialog';

export const HeaderPreferences = () => {
  const { isOpen, open, dismiss, triggerRef, currency, summary } = usePreferencesDialog();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={summary}
        aria-haspopup="dialog"
        onClick={open}
      >
        <GlobeIcon />
        <span aria-hidden="true" className={styles.currency}>
          {currency}
        </span>
      </button>
      <PreferencesDialog isOpen={isOpen} onDismiss={dismiss} />
    </>
  );
};
