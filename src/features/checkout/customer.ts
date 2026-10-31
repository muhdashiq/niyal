import { HOME_COUNTRY } from '../../config';
import { isCountryCode } from '../../i18n/countries';
import { INDIAN_STATES } from './indianStates';

export type Customer = {
  name: string;
  phone: string;
  email: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pin: string;
  notes: string;
};

export type CustomerField = keyof Customer;

// Codes rather than sentences, so this stays testable and the form can show them in any language.
export type CustomerError =
  | 'nameRequired'
  | 'phoneIndia'
  | 'phoneInternational'
  | 'emailInvalid'
  | 'countryRequired'
  | 'addressRequired'
  | 'cityRequired'
  | 'stateRequired'
  | 'pinInvalid'
  | 'postalInvalid';

export type CustomerErrors = Partial<Record<CustomerField, CustomerError>>;

// In the order they appear on the form, so the first error found is the first one on screen.
export const CUSTOMER_FIELDS = [
  'name',
  'phone',
  'email',
  'country',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'pin',
  'notes',
] as const satisfies readonly CustomerField[];

export const EMPTY_CUSTOMER: Customer = {
  name: '',
  phone: '',
  email: '',
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pin: '',
  notes: '',
};

const INDIA_DIAL_CODE = '91';

const hasCountryCode = (phone: string) => /^\s*(\+|00)/.test(phone);

// Accepts the ways people actually type a mobile number: +91 98765 43210, 098765-43210, 00971 50 123 4567.
// An Indian number comes back as ten digits and any other as +, its country code and its digits.
export const normalisePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  const international = digits.replace(/^00/, '');

  if (hasCountryCode(phone)) {
    return international.length === 12 && international.startsWith(INDIA_DIAL_CODE)
      ? international.slice(2)
      : `+${international}`;
  }
  if (digits.length === 12 && digits.startsWith(INDIA_DIAL_CODE)) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

// Indian PIN codes have no spaces. Elsewhere they can matter: SW1A 1AA.
const normalisePostalCode = (code: string, country: string) =>
  country === HOME_COUNTRY ? code.replace(/\s/g, '') : code.trim().replace(/\s+/g, ' ');

const collapseSpaces = (text: string) => text.trim().replace(/\s+/g, ' ');

export const normaliseCustomer = (customer: Customer): Customer => ({
  name: collapseSpaces(customer.name),
  phone: normalisePhone(customer.phone),
  email: customer.email.trim(),
  country: customer.country,
  addressLine1: collapseSpaces(customer.addressLine1),
  addressLine2: collapseSpaces(customer.addressLine2),
  city: collapseSpaces(customer.city),
  state: customer.state.trim(),
  pin: normalisePostalCode(customer.pin, customer.country),
  notes: customer.notes.trim(),
});

const requireText = (error: CustomerError) => (value: string) => (value.trim() === '' ? error : undefined);

// Someone in Dubai can send a gift to Kochi, so a number with a country code is fine for any
// delivery address. Only an Indian delivery can do without one.
const validatePhone = (phone: string, country: string): CustomerError | undefined => {
  const normal = normalisePhone(phone);
  const incomplete = country === HOME_COUNTRY ? 'phoneIndia' : 'phoneInternational';
  if (normal.startsWith(`+${INDIA_DIAL_CODE}`)) return incomplete;
  if (normal.startsWith('+')) return /^\+[1-9]\d{6,14}$/.test(normal) ? undefined : 'phoneInternational';
  if (country !== HOME_COUNTRY && !hasCountryCode(phone)) return 'phoneInternational';
  return /^[6-9]\d{9}$/.test(normal) ? undefined : incomplete;
};

const validateEmail = (email: string): CustomerError | undefined =>
  email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : 'emailInvalid';

const validateCountry = (country: string): CustomerError | undefined =>
  isCountryCode(country) ? undefined : 'countryRequired';

const validateState = (state: string, country: string): CustomerError | undefined => {
  if (country !== HOME_COUNTRY) return undefined;
  return INDIAN_STATES.some((known) => known === state) ? undefined : 'stateRequired';
};

// Plenty of countries have no postal code at all, the UAE and Qatar among them.
const validatePostalCode = (code: string, country: string): CustomerError | undefined => {
  const normal = normalisePostalCode(code, country);
  if (country === HOME_COUNTRY) return /^[1-9]\d{5}$/.test(normal) ? undefined : 'pinInvalid';
  return normal === '' || /^[\p{L}\p{N}][\p{L}\p{N} -]{1,11}$/u.test(normal) ? undefined : 'postalInvalid';
};

const noValidation = () => undefined;

const VALIDATORS: Record<CustomerField, (value: string, country: string) => CustomerError | undefined> = {
  name: requireText('nameRequired'),
  phone: validatePhone,
  email: validateEmail,
  country: validateCountry,
  addressLine1: requireText('addressRequired'),
  addressLine2: noValidation,
  city: requireText('cityRequired'),
  state: validateState,
  pin: validatePostalCode,
  notes: noValidation,
};

export const validateField = (field: CustomerField, value: string, country: string) =>
  VALIDATORS[field](value, country);

export const validateCustomer = (customer: Customer): CustomerErrors =>
  Object.fromEntries(
    CUSTOMER_FIELDS.flatMap((field) => {
      const error = validateField(field, customer[field], customer.country);
      return error ? [[field, error]] : [];
    }),
  );
