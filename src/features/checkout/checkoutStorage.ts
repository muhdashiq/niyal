import { readStorage, removeStorage, writeStorage } from '../../lib/storage';
import { type Customer, normaliseCustomer } from './customer';

const CUSTOMER_KEY = 'niyal.customer.v1';
const PLACED_ORDER_KEY = 'niyal.order.v1';

export type PlacedOrder = {
  orderRef: string;
  message: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const textFrom = (record: Record<string, unknown>, field: keyof Customer) => {
  const value = record[field];
  return typeof value === 'string' ? value : '';
};

export const parseStoredCustomer = (stored: unknown): Customer => {
  const record = isRecord(stored) ? stored : {};
  return {
    name: textFrom(record, 'name'),
    phone: textFrom(record, 'phone'),
    email: textFrom(record, 'email'),
    country: textFrom(record, 'country'),
    addressLine1: textFrom(record, 'addressLine1'),
    addressLine2: textFrom(record, 'addressLine2'),
    city: textFrom(record, 'city'),
    state: textFrom(record, 'state'),
    pin: textFrom(record, 'pin'),
    notes: textFrom(record, 'notes'),
  };
};

export const loadCustomer = () => parseStoredCustomer(readStorage(CUSTOMER_KEY));

// Notes belong to one order, so "gift wrap" doesn't quietly follow someone to their next one.
export const saveCustomer = (customer: Customer) =>
  writeStorage(CUSTOMER_KEY, { ...normaliseCustomer(customer), notes: '' });

// Kept for this tab only. On a phone, opening WhatsApp can unload the page, and coming back
// should still show the confirmation rather than an empty form.
export const loadPlacedOrder = (): PlacedOrder | null => {
  const stored = readStorage(PLACED_ORDER_KEY, 'sessionStorage');
  if (!isRecord(stored)) return null;
  const { orderRef, message } = stored;
  return typeof orderRef === 'string' && typeof message === 'string' ? { orderRef, message } : null;
};

export const savePlacedOrder = (order: PlacedOrder) =>
  writeStorage(PLACED_ORDER_KEY, order, 'sessionStorage');

export const clearPlacedOrder = () => removeStorage(PLACED_ORDER_KEY, 'sessionStorage');
