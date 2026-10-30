import { describe, expect, it } from 'vitest';
import {
  type Customer,
  EMPTY_CUSTOMER,
  normaliseCustomer,
  normalisePhone,
  validateCustomer,
  validateField,
} from './customer';

const validCustomer: Customer = {
  name: 'Asha Menon',
  phone: '9876543210',
  email: '',
  addressLine1: '12 MG Road',
  addressLine2: '',
  city: 'Kochi',
  state: 'Kerala',
  pin: '682016',
  notes: '',
};

describe('phone', () => {
  it.each(['9876543210', '98765 43210', '+91 98765 43210', '+919876543210', '09876543210', '98765-43210'])(
    'accepts %s',
    (phone) => {
      expect(validateField('phone', phone)).toBeUndefined();
      expect(normalisePhone(phone)).toBe('9876543210');
    },
  );

  it.each(['', '12345', '987654321', '98765432100', '5876543210', 'not a number'])('rejects "%s"', (phone) => {
    expect(validateField('phone', phone)).toBeDefined();
  });
});

describe('email', () => {
  it('is optional', () => {
    expect(validateField('email', '')).toBeUndefined();
    expect(validateField('email', '   ')).toBeUndefined();
  });

  it('is checked when present', () => {
    expect(validateField('email', 'asha@example.com')).toBeUndefined();
    expect(validateField('email', 'asha@example')).toBeDefined();
    expect(validateField('email', 'asha example.com')).toBeDefined();
  });
});

describe('PIN code', () => {
  it('needs six digits and cannot start with zero', () => {
    expect(validateField('pin', '682016')).toBeUndefined();
    expect(validateField('pin', '682 016')).toBeUndefined();
    expect(validateField('pin', '68201')).toBeDefined();
    expect(validateField('pin', '6820161')).toBeDefined();
    expect(validateField('pin', '082016')).toBeDefined();
  });
});

describe('state', () => {
  it('must be a real state or union territory', () => {
    expect(validateField('state', 'Kerala')).toBeUndefined();
    expect(validateField('state', 'Ladakh')).toBeUndefined();
    expect(validateField('state', 'Atlantis')).toBeDefined();
    expect(validateField('state', '')).toBeDefined();
  });
});

describe('validateCustomer', () => {
  it('passes a complete customer', () => {
    expect(validateCustomer(validCustomer)).toEqual({});
  });

  it('reports every required field on an empty form, and no optional ones', () => {
    expect(Object.keys(validateCustomer(EMPTY_CUSTOMER))).toEqual([
      'name',
      'phone',
      'addressLine1',
      'city',
      'state',
      'pin',
    ]);
  });

  it('treats a field of only spaces as empty', () => {
    expect(validateCustomer({ ...validCustomer, name: '   ' }).name).toBeDefined();
  });
});

describe('normaliseCustomer', () => {
  it('tidies stray spaces and number formats', () => {
    const customer = normaliseCustomer({
      ...validCustomer,
      name: '  Asha   Menon ',
      phone: '+91 98765 43210',
      pin: '682 016',
      notes: '  Gift wrap  ',
    });
    expect(customer.name).toBe('Asha Menon');
    expect(customer.phone).toBe('9876543210');
    expect(customer.pin).toBe('682016');
    expect(customer.notes).toBe('Gift wrap');
  });
});
