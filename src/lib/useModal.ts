import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// What every modal needs while it is open: focus moves inside and stays there,
// Esc closes it, and the page behind stops scrolling. The caller decides where
// focus goes afterwards, because that depends on how the modal was closed.
export const useModal = (containerRef: RefObject<HTMLElement>, onClose: () => void) => {
  const latestOnClose = useRef(onClose);

  useEffect(() => {
    latestOnClose.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        latestOnClose.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;
      const hasEscaped = !container.contains(active);
      if (hasEscaped || (!event.shiftKey && active === last)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    focusableElements()[0]?.focus();
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [containerRef]);
};
