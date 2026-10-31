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
  country: 'IN',
  addressLine1: '12 MG Road',
  addressLine2: '',
  city: 'Kochi',
  state: 'Kerala',
  pin: '682016',
  notes: '',
};

const customerAbroad: Customer = {
  ...validCustomer,
  phone: '+971 50 123 4567',
  country: 'AE',
  city: 'Dubai',
  state: '',
  pin: '',
};

describe('phone in India', () => {
  it.each(['9876543210', '98765 43210', '+91 98765 43210', '+919876543210', '09876543210', '98765-43210', '0091 98765 43210'])(
    'accepts %s',
    (phone) => {
      expect(validateField('phone', phone, 'IN')).toBeUndefined();
      expect(normalisePhone(phone)).toBe('9876543210');
    },
  );

  it.each(['', '12345', '987654321', '98765432100', '5876543210', 'not a number', '+91 12345'])('rejects "%s"', (phone) => {
    expect(validateField('phone', phone, 'IN')).toBeDefined();
  });

  it('accepts a foreign number for someone ordering from abroad', () => {
    expect(validateField('phone', '+971 50 123 4567', 'IN')).toBeUndefined();
  });
});

describe('phone abroad', () => {
  it.each(['+971 50 123 4567', '+1 (415) 555-0100', '00971501234567', '+44 7700 900123'])('accepts %s', (phone) => {
    expect(validateField('phone', phone, 'AE')).toBeUndefined();
  });

  it.each(['', '050 123 4567', '9876543210', '+12', '+0501234567'])('rejects "%s"', (phone) => {
    expect(validateField('phone', phone, 'AE')).toBe('phoneInternational');
  });

  it('accepts an Indian number with its country code', () => {
    expect(validateField('phone', '+91 98765 43210', 'AE')).toBeUndefined();
  });

  it('keeps the country code in one format', () => {
    expect(normalisePhone('+971 50 123 4567')).toBe('+971501234567');
    expect(normalisePhone('00971 50 123 4567')).toBe('+971501234567');
    expect(normalisePhone('+1 (415) 555-0100')).toBe('+14155550100');
  });
});

describe('email', () => {
  it('is optional', () => {
    expect(validateField('email', '', 'IN')).toBeUndefined();
    expect(validateField('email', '   ', 'IN')).toBeUndefined();
  });

  it('is checked when present', () => {
    expect(validateField('email', 'asha@example.com', 'IN')).toBeUndefined();
    expect(validateField('email', 'asha@example', 'IN')).toBeDefined();
    expect(validateField('email', 'asha example.com', 'IN')).toBeDefined();
  });
});

describe('country', () => {
  it('must be a known country', () => {
    expect(validateField('country', 'AE', 'AE')).toBeUndefined();
    expect(validateField('country', 'ZZ', 'ZZ')).toBe('countryRequired');
    expect(validateField('country', '', '')).toBe('countryRequired');
  });
});

describe('postal code', () => {
  it('needs six digits in India and cannot start with zero', () => {
    expect(validateField('pin', '682016', 'IN')).toBeUndefined();
    expect(validateField('pin', '682 016', 'IN')).toBeUndefined();
    expect(validateField('pin', '68201', 'IN')).toBeDefined();
    expect(validateField('pin', '6820161', 'IN')).toBeDefined();
    expect(validateField('pin', '082016', 'IN')).toBeDefined();
  });

  it('is optional abroad, since many countries have none', () => {
    expect(validateField('pin', '', 'AE')).toBeUndefined();
  });

  it.each(['SW1A 1AA', '10115', 'K1A 0B1', '113-0033'])('accepts %s abroad', (code) => {
    expect(validateField('pin', code, 'GB')).toBeUndefined();
  });

  it('rejects something that cannot be a postal code', () => {
    expect(validateField('pin', '!!!', 'GB')).toBe('postalInvalid');
    expect(validateField('pin', '1234567890123', 'GB')).toBe('postalInvalid');
  });
});

describe('state', () => {
  it('must be a real state or union territory in India', () => {
    expect(validateField('state', 'Kerala', 'IN')).toBeUndefined();
    expect(validateField('state', 'Ladakh', 'IN')).toBeUndefined();
    expect(validateField('state', 'Atlantis', 'IN')).toBeDefined();
    expect(validateField('state', '', 'IN')).toBeDefined();
  });

  it('is free text and optional abroad', () => {
    expect(validateField('state', '', 'AE')).toBeUndefined();
    expect(validateField('state', 'California', 'US')).toBeUndefined();
  });
});

describe('validateCustomer', () => {
  it('passes a complete customer', () => {
    expect(validateCustomer(validCustomer)).toEqual({});
  });

  it('passes a complete customer abroad with no state or postal code', () => {
    expect(validateCustomer(customerAbroad)).toEqual({});
  });

  it('reports every required field on an empty form, and no optional ones', () => {
    expect(Object.keys(validateCustomer({ ...EMPTY_CUSTOMER, country: 'IN' }))).toEqual([
      'name',
      'phone',
      'addressLine1',
      'city',
      'state',
      'pin',
    ]);
  });

  it('asks for less on an empty form abroad', () => {
    expect(Object.keys(validateCustomer({ ...EMPTY_CUSTOMER, country: 'AE' }))).toEqual([
      'name',
      'phone',
      'addressLine1',
      'city',
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

  it('keeps the space in a foreign postal code', () => {
    const customer = normaliseCustomer({ ...customerAbroad, country: 'GB', pin: ' SW1A   1AA ' });
    expect(customer.pin).toBe('SW1A 1AA');
  });
});
