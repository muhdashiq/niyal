import { describe, expect, it } from 'vitest';
import { EMPTY_CUSTOMER } from './customer';
import { parseStoredCustomer } from './checkoutStorage';

describe('parseStoredCustomer', () => {
  it('keeps saved text fields', () => {
    expect(parseStoredCustomer({ name: 'Asha', city: 'Kochi' })).toEqual({
      ...EMPTY_CUSTOMER,
      name: 'Asha',
      city: 'Kochi',
    });
  });

  it('blanks anything that is not text', () => {
    expect(parseStoredCustomer({ name: 42, phone: null, city: ['Kochi'] })).toEqual(EMPTY_CUSTOMER);
  });

  it('gives an empty customer for missing or malformed data', () => {
    expect(parseStoredCustomer(null)).toEqual(EMPTY_CUSTOMER);
    expect(parseStoredCustomer('text')).toEqual(EMPTY_CUSTOMER);
  });

  it('ignores fields it does not know', () => {
    expect(parseStoredCustomer({ card: '4111' })).toEqual(EMPTY_CUSTOMER);
  });
});
