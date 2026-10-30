import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../lib/formatCurrency';
import { useCart } from './CartProvider';
import { describeItemCount, type PricedLine } from './cartTotals';
import { lineKey, useCartUi } from './CartUiProvider';

const describeLine = ({ perfume, size }: PricedLine) => `${perfume.name}, ${size} ml`;

const describeChanges = (previous: readonly PricedLine[], next: readonly PricedLine[]) => {
  const keyOf = (line: PricedLine) => lineKey(line.perfumeId, line.size);
  const previousByKey = new Map(previous.map((line) => [keyOf(line), line]));
  const nextKeys = new Set(next.map(keyOf));

  const addedOrChanged = next.flatMap((line) => {
    const before = previousByKey.get(keyOf(line));
    if (!before) return `Added ${describeLine(line)}, quantity ${line.quantity}.`;
    if (before.quantity === line.quantity) return [];
    return `${describeLine(line)}, quantity now ${line.quantity}.`;
  });
  const removed = previous
    .filter((line) => !nextKeys.has(keyOf(line)))
    .map((line) => `Removed ${describeLine(line)}.`);

  return [...removed, ...addedOrChanged].join(' ');
};

// The one place cart changes are read out to screen readers. It compares the bag before and
// after, so every way of changing the bag is covered without each control announcing itself.
export const CartAnnouncer = () => {
  const { lines, itemCount, total } = useCart();
  const { toast } = useCartUi();
  const previousLines = useRef(lines);
  const previousToast = useRef(toast);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const changes = describeChanges(previousLines.current, lines);
    const summary = changes
      ? `${changes} Your bag has ${describeItemCount(itemCount)}, total ${formatCurrency(total)}.`
      : '';
    const isNewNotice = toast !== previousToast.current && toast?.kind === 'notice';
    const message = [summary, isNewNotice ? toast.message : ''].filter(Boolean).join(' ');

    previousLines.current = lines;
    previousToast.current = toast;
    if (message) setAnnouncement(message);
  }, [lines, itemCount, total, toast]);

  return (
    <p aria-live="polite" className="visually-hidden">
      {announcement}
    </p>
  );
};
