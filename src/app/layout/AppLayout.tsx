import type { MouseEvent } from 'react';
import { CartAnnouncer } from '../../features/cart/CartAnnouncer';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { CartToast } from '../../features/cart/CartToast';
import { useCartUi } from '../../features/cart/CartUiProvider';
import styles from './AppLayout.module.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { focusMainContent, MAIN_CONTENT_ID } from './mainContent';
import { PageTransition } from './PageTransition';

// HashRouter reads the URL hash as a route, so the default jump would land on the 404 page.
const skipToContent = (event: MouseEvent) => {
  event.preventDefault();
  focusMainContent();
};

export const AppLayout = () => {
  const { isDrawerOpen } = useCartUi();

  return (
    <div className={styles.shell}>
      <a href={`#${MAIN_CONTENT_ID}`} className={styles.skipLink} onClick={skipToContent}>
        Skip to content
      </a>
      <Header />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
        <PageTransition />
      </main>
      <Footer />
      <CartDrawer />
      {!isDrawerOpen && <CartToast placement="page" />}
      <CartAnnouncer />
    </div>
  );
};
