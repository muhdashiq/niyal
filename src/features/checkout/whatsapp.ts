import { BRAND_NAME, ORDER_REF_PREFIX } from '../../config';
import { formatCurrency } from '../../lib/formatCurrency';
import type { CartTotals, PricedLine } from '../cart/cartTotals';
import { type Customer, normaliseCustomer } from './customer';

export type OrderCart = CartTotals & {
  lines: readonly PricedLine[];
};

// Left out the letters and digits that are easy to misread when someone reads a reference aloud.
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REF_RANDOM_LENGTH = 4;

const twoDigits = (value: number) => String(value).padStart(2, '0');

export const createOrderRef = (date = new Date(), random = Math.random) => {
  const stamp = `${twoDigits(date.getFullYear() % 100)}${twoDigits(date.getMonth() + 1)}${twoDigits(date.getDate())}`;
  const suffix = Array.from(
    { length: REF_RANDOM_LENGTH },
    () => REF_ALPHABET[Math.floor(random() * REF_ALPHABET.length)],
  ).join('');
  return `${ORDER_REF_PREFIX}-${stamp}-${suffix}`;
};

const describeShipping = (shipping: number) =>
  shipping === 0 ? 'Free' : `${formatCurrency(shipping)} (estimate)`;

// Drops empty lines within a section, and any section left with nothing in it, so optional
// fields disappear cleanly instead of leaving a blank label or a gap.
const joinSections = (sections: readonly (readonly string[])[]) =>
  sections
    .map((section) => section.filter(Boolean).join('\n'))
    .filter(Boolean)
    .join('\n\n');

// Takes the order reference as an argument, because creating one is random and this stays pure.
export const buildWhatsAppMessage = (cart: OrderCart, customer: Customer, orderRef: string) => {
  const { name, phone, email, addressLine1, addressLine2, city, state, pin, notes } =
    normaliseCustomer(customer);

  return joinSections([
    [`*New Order – ${BRAND_NAME}*`, `Order ref: ${orderRef}`],
    ['*Customer*', `Name: ${name}`, `Phone: +91 ${phone}`, email && `Email: ${email}`],
    ['*Delivery address*', addressLine1, addressLine2, `${city}, ${state} – ${pin}`],
    [
      '*Order*',
      ...cart.lines.map(
        (line, index) =>
          `${index + 1}. ${line.perfume.name} – ${line.size} ml × ${line.quantity} = ${formatCurrency(line.lineTotal)}`,
      ),
    ],
    [
      `Subtotal: ${formatCurrency(cart.subtotal)}`,
      `Shipping: ${describeShipping(cart.shipping)}`,
      `*Total: ${formatCurrency(cart.total)}*`,
    ],
    [notes && `Notes: ${notes}`],
  ]);
};
