import { useEffect, useRef, useState } from 'react';
import { MAX_QUANTITY } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import type { Messages } from '../../i18n/messages/en';
import { useCart } from './CartProvider';
import type { PricedLine } from './cartTotals';
import { lineKey, useCartUi } from './CartUiProvider';

const describeChanges = (
  previous: readonly PricedLine[],
  next: readonly PricedLine[],
  t: Messages,
  formatSize: (size: number) => string,
) => {
  const keyOf = (line: PricedLine) => lineKey(line.perfumeId, line.size);
  const nameOf = ({ perfume, size }: PricedLine) => t.common.lineName(perfume.name, formatSize(size));
  const previousByKey = new Map(previous.map((line) => [keyOf(line), line]));
  const nextKeys = new Set(next.map(keyOf));

  const addedOrChanged = next.flatMap((line) => {
    const before = previousByKey.get(keyOf(line));
    if (!before) return t.cart.announceAdded(nameOf(line), line.quantity);
    if (before.quantity === line.quantity) return [];
    return t.cart.announceChanged(nameOf(line), line.quantity);
  });
  const removed = previous
    .filter((line) => !nextKeys.has(keyOf(line)))
    .map((line) => t.cart.announceRemoved(nameOf(line)));

  return [...removed, ...addedOrChanged].join(' ');
};

// The one place cart changes are read out to screen readers. It compares the bag before and
// after, so every way of changing the bag is covered without each control announcing itself.
export const CartAnnouncer = () => {
  const { lines, itemCount, total } = useCart();
  const { toast } = useCartUi();
  const { t, formatPrice, formatSize } = useLocale();
  const previousLines = useRef(lines);
  const previousToast = useRef(toast);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const changes = describeChanges(previousLines.current, lines, t, formatSize);
    const summary = changes
      ? `${changes} ${t.cart.announceTotal(t.cart.itemCount(itemCount), formatPrice(total))}`
      : '';
    const isNewNotice = toast !== previousToast.current && toast?.kind === 'limit';
    const message = [summary, isNewNotice ? t.cart.limit(MAX_QUANTITY) : ''].filter(Boolean).join(' ');

    previousLines.current = lines;
    previousToast.current = toast;
    if (message) setAnnouncement(message);
  }, [lines, itemCount, total, toast, t, formatPrice, formatSize]);

  return (
    <p aria-live="polite" className="visually-hidden">
      {announcement}
    </p>
  );
};
