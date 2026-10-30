import { AnimatePresence, m, type Variants } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../../components/icons';
import { IconButton } from '../../components/IconButton';
import { DESKTOP_QUERY } from '../../lib/breakpoints';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import { useModal } from '../../lib/useModal';
import styles from './MobileMenu.module.css';
import { NAV_LINKS } from './navigation';
import { Wordmark } from './Wordmark';

type MobileMenuProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onNavigate: () => void;
};

const LINK_LIST_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const LINK_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_SETTLE } },
};

const MenuOverlay = ({ onDismiss, onNavigate }: Omit<MobileMenuProps, 'isOpen'>) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  useModal(overlayRef, onDismiss);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) onNavigate();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [onNavigate]);

  return (
    <m.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-surface="dark"
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_SETTLE }}
    >
      <div className={styles.topBar}>
        <div className={styles.closeSlot}>
          <IconButton label="Close menu" onClick={onDismiss}>
            <CloseIcon />
          </IconButton>
        </div>
        <Wordmark />
      </div>

      <nav aria-label="Main" className={styles.nav}>
        <m.ul variants={LINK_LIST_VARIANTS} initial="hidden" animate="visible">
          {NAV_LINKS.map((link) => (
            <m.li key={link.to} variants={LINK_VARIANTS}>
              <Link to={link.to} className={`text-h1 ${styles.link}`} onClick={onNavigate}>
                {link.label}
              </Link>
            </m.li>
          ))}
        </m.ul>
      </nav>
    </m.div>
  );
};

export const MobileMenu = ({ isOpen, onDismiss, onNavigate }: MobileMenuProps) => (
  <AnimatePresence>
    {isOpen && <MenuOverlay onDismiss={onDismiss} onNavigate={onNavigate} />}
  </AnimatePresence>
);
