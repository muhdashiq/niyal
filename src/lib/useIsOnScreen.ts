import { type RefObject, useEffect, useState } from 'react';

export const useIsOnScreen = (elementRef: RefObject<Element>) => {
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsOnScreen(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return isOnScreen;
};
