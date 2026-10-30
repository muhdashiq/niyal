import { INDIAN_STATES } from './indianStates';

export type Customer = {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pin: string;
  notes: string;
};

export type CustomerField = keyof Customer;
export type CustomerErrors = Partial<Record<CustomerField, string>>;

// In the order they appear on the form, so the first error found is the first one on screen.
export const CUSTOMER_FIELDS = [
  'name',
  'phone',
  'email',
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
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pin: '',
  notes: '',
};

// Accepts the ways people actually type a mobile number: +91 98765 43210, 098765-43210.
export const normalisePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

const normalisePin = (pin: string) => pin.replace(/\s/g, '');

const collapseSpaces = (text: string) => text.trim().replace(/\s+/g, ' ');

export const normaliseCustomer = (customer: Customer): Customer => ({
  name: collapseSpaces(customer.name),
  phone: normalisePhone(customer.phone),
  email: customer.email.trim(),
  addressLine1: collapseSpaces(customer.addressLine1),
  addressLine2: collapseSpaces(customer.addressLine2),
  city: collapseSpaces(customer.city),
  state: customer.state.trim(),
  pin: normalisePin(customer.pin),
  notes: customer.notes.trim(),
});

const requireText = (message: string) => (value: string) =>
  value.trim() === '' ? message : undefined;

const validatePhone = (phone: string) =>
  /^[6-9]\d{9}$/.test(normalisePhone(phone))
    ? undefined
    : 'Enter a 10-digit Indian mobile number, like 98765 43210.';

const validateEmail = (email: string) =>
  email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? undefined
    : 'Enter a full email address, like name@example.com, or leave this blank.';

const validateState = (state: string) =>
  INDIAN_STATES.some((known) => known === state) ? undefined : 'Choose your state or union territory.';

const validatePin = (pin: string) =>
  /^[1-9]\d{5}$/.test(normalisePin(pin)) ? undefined : 'Enter your 6-digit PIN code.';

const noValidation = () => undefined;

const VALIDATORS: Record<CustomerField, (value: string) => string | undefined> = {
  name: requireText('Enter your full name.'),
  phone: validatePhone,
  email: validateEmail,
  addressLine1: requireText('Enter your house or flat number and street.'),
  addressLine2: noValidation,
  city: requireText('Enter your city.'),
  state: validateState,
  pin: validatePin,
  notes: noValidation,
};

export const validateField = (field: CustomerField, value: string) => VALIDATORS[field](value);

export const validateCustomer = (customer: Customer): CustomerErrors =>
  Object.fromEntries(
    CUSTOMER_FIELDS.flatMap((field) => {
      const error = validateField(field, customer[field]);
      return error ? [[field, error]] : [];
    }),
  );
