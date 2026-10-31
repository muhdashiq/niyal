// Business configuration: WhatsApp number, currency, brand name, shipping rule.
export const BRAND_NAME = 'Niyal';
export const ORDER_REF_PREFIX = 'NYL';

// TODO: replace with Niyal's WhatsApp number. International format, digits only.
export const WHATSAPP_NUMBER = '91XXXXXXXXXX';

// Where the site is published. Share previews need the full address.
export const SITE_URL = 'https://muhdashiq.com/niyal';

// TODO: replace with Niyal's Instagram profile.
export const INSTAGRAM_URL = 'https://www.instagram.com/';

// Prices in perfumes.ts are in rupees, and these turn them into everything else. The rates are
// fixed, not live, so update them when you want prices to move. Taken on 31 October 2026.
// Converted prices round up to the nearest `roundTo`, so a bottle never sells below its rupee price.
export const CURRENCIES = {
  INR: { rupeesPerUnit: 1, roundTo: 1 },
  USD: { rupeesPerUnit: 95.08, roundTo: 1 },
  AED: { rupeesPerUnit: 25.89, roundTo: 1 },
  SAR: { rupeesPerUnit: 25.35, roundTo: 1 },
  OMR: { rupeesPerUnit: 247.28, roundTo: 0.5 },
  BHD: { rupeesPerUnit: 252.84, roundTo: 0.5 },
  KWD: { rupeesPerUnit: 305.62, roundTo: 0.5 },
  QAR: { rupeesPerUnit: 26.12, roundTo: 1 },
  EUR: { rupeesPerUnit: 106.09, roundTo: 1 },
  GBP: { rupeesPerUnit: 127.23, roundTo: 1 },
} as const satisfies Record<string, { rupeesPerUnit: number; roundTo: number }>;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = [
  'INR',
  'USD',
  'AED',
  'SAR',
  'OMR',
  'BHD',
  'KWD',
  'QAR',
  'EUR',
  'GBP',
] as const satisfies readonly CurrencyCode[];

export const HOME_CURRENCY: CurrencyCode = 'INR';

// Bottles per cart line.
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

// Orders to this country use the two shipping figures below. Anywhere else pays international
// courier charges, which are agreed on WhatsApp.
export const HOME_COUNTRY = 'IN';

// Rupees. Shipping is shown as an estimate in the WhatsApp message.
export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 150;
