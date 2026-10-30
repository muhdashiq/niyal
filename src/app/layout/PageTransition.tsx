import { AnimatePresence, m, type Variants } from 'motion/react';
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { type Location, useLocation } from 'react-router-dom';
import { DURATION, EASE_SETTLE } from '../../lib/motion';
import { AppRoutes } from '../routes';
import { focusMainContent } from './mainContent';

const PAGE_VARIANTS: Variants = {
  entering: { opacity: 0, y: 8 },
  settled: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_SETTLE } },
  leaving: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_SETTLE } },
};

// One scroll position per history entry, so the back button returns to the same spot.
// The browser can't do this itself, because the next page mounts only after the old one has faded.
const scrollPositions = new Map<string, number>();

type PageProps = {
  location: Location;
  skipEntrance: boolean;
};

const Page = ({ location, skipEntrance }: PageProps) => {
  // Runs once per page. Query changes on the same page, like filters, must not move the scroll.
  useLayoutEffect(() => {
    window.scrollTo(0, scrollPositions.get(location.key) ?? 0);
    if (location.key !== 'default') focusMainContent();
  }, []);

  return (
    <m.div
      variants={PAGE_VARIANTS}
      initial={skipEntrance ? false : 'entering'}
      animate="settled"
      exit="leaving"
    >
      <Suspense fallback={null}>
        <AppRoutes location={location} />
      </Suspense>
    </m.div>
  );
};

export const PageTransition = () => {
  const location = useLocation();
  const currentEntryKey = useRef(location.key);
  const isFirstPage = useRef(true);

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    scrollPositions.set(currentEntryKey.current, window.scrollY);
    currentEntryKey.current = location.key;
  }, [location.key]);

  useEffect(() => {
    isFirstPage.current = false;
  }, []);

  // The first page skips its fade here on the page itself. Setting initial={false} on
  // AnimatePresence instead would also switch off the scroll reveals inside the page.
  return (
    <AnimatePresence mode="wait">
      <Page key={location.pathname} location={location} skipEntrance={isFirstPage.current} />
    </AnimatePresence>
  );
};
