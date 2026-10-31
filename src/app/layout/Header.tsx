import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon } from '../../components/icons';
import { IconButton } from '../../components/IconButton';
import { CartButton } from '../../features/cart/CartButton';
import { useCart } from '../../features/cart/CartProvider';
import { HeaderPreferences } from '../../features/preferences/HeaderPreferences';
import { useLocale } from '../../i18n/LocaleProvider';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS } from './navigation';
import { Wordmark } from './Wordmark';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { t } = useLocale();

  const dismissMenu = () => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header data-surface="dark" className={styles.header}>
      <div className={`page-width ${styles.bar}`}>
        <div className={styles.start}>
          <div className={styles.menuSlot}>
            <IconButton
              ref={menuButtonRef}
              label={t.layout.openMenu}
              aria-haspopup="dialog"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <nav aria-label={t.layout.mainNavigation} className={styles.nav}>
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={styles.navLink}
                    aria-current={link.to === pathname ? 'page' : undefined}
                  >
                    {t.layout[link.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Wordmark />

        <div className={styles.end}>
          <HeaderPreferences />
          <CartButton count={itemCount} />
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onDismiss={dismissMenu}
        onNavigate={() => setIsMenuOpen(false)}
      />
    </header>
  );
};
