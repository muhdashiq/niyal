import { BRAND_NAME, HOME_COUNTRY, HOME_CURRENCY, ORDER_REF_PREFIX } from '../../config';
import { countryName } from '../../i18n/countries';
import { LANGUAGES, type LanguageCode } from '../../i18n/languages';
import { formatMoney, type Money } from '../../lib/money';
import type { CartTotals, PricedLine, Shipping } from '../cart/cartTotals';
import { type Customer, normaliseCustomer } from './customer';

export type OrderCart = CartTotals & {
  lines: readonly PricedLine[];
};

// Always in English, whatever language the customer browsed in, so the team can read every order.
const ORDER_LOCALE = 'en-IN';

const formatOrderMoney = (money: Money) => formatMoney(money, ORDER_LOCALE);

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

const describeShipping = (shipping: Shipping) => {
  if (shipping.kind === 'free') return 'Free';
  if (shipping.kind === 'flat') return `${formatOrderMoney(shipping.fee)} (estimate)`;
  return 'International courier, charge to be confirmed';
};

const describeTotal = (total: Money, shipping: Shipping) =>
  shipping.kind === 'courier'
    ? `*Total: ${formatOrderMoney(total)} (before courier charges)*`
    : `*Total: ${formatOrderMoney(total)}*`;

const describePhone = (phone: string) => (phone.startsWith('+') ? phone : `+91 ${phone}`);

const describeCityLine = ({ city, state, pin, country }: Customer) => {
  if (country === HOME_COUNTRY) return `${city}, ${state} – ${pin}`;
  const place = [city, state].filter(Boolean).join(', ');
  return pin ? `${place} – ${pin}` : place;
};

// Drops empty lines within a section, and any section left with nothing in it, so optional
// fields disappear cleanly instead of leaving a blank label or a gap.
const joinSections = (sections: readonly (readonly string[])[]) =>
  sections
    .map((section) => section.filter(Boolean).join('\n'))
    .filter(Boolean)
    .join('\n\n');

// Takes the order reference as an argument, because creating one is random and this stays pure.
export const buildWhatsAppMessage = (
  cart: OrderCart,
  customer: Customer,
  orderRef: string,
  language: LanguageCode = 'en',
) => {
  const normal = normaliseCustomer(customer);
  const { name, phone, email, addressLine1, addressLine2, country, notes } = normal;
  const { subtotal, rupeeSubtotal, shipping, total } = cart;

  return joinSections([
    [`*New Order – ${BRAND_NAME}*`, `Order ref: ${orderRef}`],
    [
      '*Customer*',
      `Name: ${name}`,
      `Phone: ${describePhone(phone)}`,
      email && `Email: ${email}`,
      language === 'en' ? '' : `Language: ${LANGUAGES[language].englishName}`,
    ],
    [
      '*Delivery address*',
      addressLine1,
      addressLine2,
      describeCityLine(normal),
      country === HOME_COUNTRY ? '' : countryName(country, ORDER_LOCALE),
    ],
    [
      '*Order*',
      ...cart.lines.map(
        (line, index) =>
          `${index + 1}. ${line.perfume.name} – ${line.size} ml × ${line.quantity} = ${formatOrderMoney(line.lineTotal)}`,
      ),
    ],
    [
      `Subtotal: ${formatOrderMoney(subtotal)}`,
      `Shipping: ${describeShipping(shipping)}`,
      describeTotal(total, shipping),
      subtotal.currency === HOME_CURRENCY
        ? ''
        : `Subtotal in rupees: ${formatOrderMoney({ amount: rupeeSubtotal, currency: HOME_CURRENCY })}`,
    ],
    [notes && `Notes: ${notes}`],
  ]);
};
