import { describe, expect, it } from 'vitest';
import { type Money, moneyFromRupees, multiplyMoney } from '../../lib/money';
import type { Perfume } from '../../types';
import { calculateTotals, type PricedLine } from '../cart/cartTotals';
import type { Customer } from './customer';
import { buildWhatsAppMessage, createOrderRef, type OrderCart } from './whatsapp';

const perfumeNamed = (name: string): Perfume => ({
  id: name,
  name,
  tagline: '',
  description: '',
  family: 'Woody',
  notes: { top: [], heart: [], base: [] },
  concentration: 'Eau de Parfum',
  prices: { 30: 1, 50: 1, 90: 1, 100: 1 },
  accent: '#000000',
});

const rupees = (amount: number): Money => ({ amount, currency: 'INR' });

const line = (
  name: string,
  size: PricedLine['size'],
  quantity: number,
  unitRupees: number,
  currency: Money['currency'] = 'INR',
): PricedLine => {
  const unitPrice = moneyFromRupees(unitRupees, currency);
  return {
    perfumeId: name,
    perfume: perfumeNamed(name),
    size,
    quantity,
    unitPrice,
    lineTotal: multiplyMoney(unitPrice, quantity),
    rupeeTotal: unitRupees * quantity,
  };
};

const cart: OrderCart = {
  lines: [line('Oud Noir', 50, 2, 3200), line('Rose Atelier', 30, 1, 1800)],
  itemCount: 3,
  subtotal: rupees(8200),
  rupeeSubtotal: 8200,
  shipping: { kind: 'free' },
  total: rupees(8200),
};

const fullCustomer: Customer = {
  name: 'Asha Menon',
  phone: '9876543210',
  email: 'asha@example.com',
  country: 'IN',
  addressLine1: '12 MG Road',
  addressLine2: 'Near the old library',
  city: 'Kochi',
  state: 'Kerala',
  pin: '682016',
  notes: 'Make it less sweet',
};

const requiredOnly: Customer = { ...fullCustomer, email: '', addressLine2: '', notes: '' };

const customerAbroad: Customer = {
  ...requiredOnly,
  phone: '+971 50 123 4567',
  country: 'AE',
  addressLine1: 'Villa 7, Al Wasl Road',
  city: 'Dubai',
  state: '',
  pin: '',
};

const orderIn = (currency: Money['currency'], country: string) => {
  const lines = [line('Oud Noir', 50, 2, 3200, currency)];
  return { lines, ...calculateTotals(lines, currency, country) };
};

describe('buildWhatsAppMessage', () => {
  it('produces the agreed format with every field filled in', () => {
    expect(buildWhatsAppMessage(cart, fullCustomer, 'NYL-261030-AB2C')).toBe(
      [
        '*New Order – Niyal*',
        'Order ref: NYL-261030-AB2C',
        '',
        '*Customer*',
        'Name: Asha Menon',
        'Phone: +91 9876543210',
        'Email: asha@example.com',
        '',
        '*Delivery address*',
        '12 MG Road',
        'Near the old library',
        'Kochi, Kerala – 682016',
        '',
        '*Order*',
        '1. Oud Noir – 50 ml × 2 = ₹6,400',
        '2. Rose Atelier – 30 ml × 1 = ₹1,800',
        '',
        'Subtotal: ₹8,200',
        'Shipping: Free',
        '*Total: ₹8,200*',
        '',
        'Notes: Make it less sweet',
      ].join('\n'),
    );
  });

  it('leaves out empty optional fields without a trace', () => {
    const message = buildWhatsAppMessage(cart, requiredOnly, 'REF');
    expect(message).not.toContain('Email');
    expect(message).not.toContain('Notes');
    expect(message).not.toContain('undefined');
    expect(message).toContain('*Delivery address*\n12 MG Road\nKochi, Kerala – 682016');
    expect(message.endsWith('*Total: ₹8,200*')).toBe(true);
    expect(message).not.toMatch(/\n{3,}/);
  });

  it('treats optional fields of only spaces as empty', () => {
    const message = buildWhatsAppMessage(
      cart,
      { ...requiredOnly, email: '  ', addressLine2: '   ', notes: ' \n ' },
      'REF',
    );
    expect(message).toBe(buildWhatsAppMessage(cart, requiredOnly, 'REF'));
  });

  it('shows a shipping fee as an estimate and includes it in the total', () => {
    const message = buildWhatsAppMessage(
      {
        lines: [line('Kaapi', 30, 1, 1600)],
        itemCount: 1,
        subtotal: rupees(1600),
        rupeeSubtotal: 1600,
        shipping: { kind: 'flat', fee: rupees(150) },
        total: rupees(1750),
      },
      requiredOnly,
      'REF',
    );
    expect(message).toContain('Shipping: ₹150 (estimate)');
    expect(message).toContain('*Total: ₹1,750*');
  });

  it('prints the phone number in one format however it was typed', () => {
    const message = buildWhatsAppMessage(cart, { ...requiredOnly, phone: '+91 98765-43210' }, 'REF');
    expect(message).toContain('Phone: +91 9876543210');
  });
});

describe('orders from abroad', () => {
  const message = buildWhatsAppMessage(orderIn('AED', 'AE'), customerAbroad, 'REF');

  it('prints the full international phone number', () => {
    expect(message).toContain('Phone: +971501234567');
    expect(message).not.toContain('+91');
  });

  it('names the country in English and skips a missing state and postal code', () => {
    expect(message).toContain('*Delivery address*\nVilla 7, Al Wasl Road\nDubai\nUnited Arab Emirates');
  });

  it('says the courier charge is still to come, in the total as well', () => {
    expect(message).toContain('Shipping: International courier, charge to be confirmed');
    expect(message).toMatch(/\*Total: AED\s[\d,]+ \(before courier charges\)\*/);
  });

  it('gives the rupee subtotal so the team can check the conversion', () => {
    expect(message).toContain('Subtotal in rupees: ₹6,400');
  });

  it('adds up in the chosen currency', () => {
    const unit = moneyFromRupees(3200, 'AED').amount;
    expect(message).toContain(`Oud Noir – 50 ml × 2 = AED\u00a0${unit * 2}`);
    expect(message).toContain(`Subtotal: AED\u00a0${unit * 2}`);
  });
});

describe('language and currency on the order', () => {
  it('stays in English and names the language the customer used', () => {
    const message = buildWhatsAppMessage(cart, requiredOnly, 'REF', 'ta');
    expect(message).toContain('Language: Tamil');
    expect(message).toContain('*Delivery address*');
    expect(message).toContain('Subtotal: ₹8,200');
  });

  it('does not mention the language for an English customer', () => {
    expect(buildWhatsAppMessage(cart, requiredOnly, 'REF', 'en')).not.toContain('Language:');
  });

  it('keeps Indian delivery rules with a foreign currency', () => {
    const message = buildWhatsAppMessage(orderIn('USD', 'IN'), requiredOnly, 'REF');
    expect(message).toContain('Kochi, Kerala – 682016');
    expect(message).toContain('Shipping: Free');
    expect(message).toContain('Subtotal in rupees: ₹6,400');
  });
});

describe('createOrderRef', () => {
  it('follows NYL-YYMMDD plus four characters', () => {
    const ref = createOrderRef(new Date(2026, 9, 5), () => 0);
    expect(ref).toBe('NYL-261005-AAAA');
  });

  it('uses only characters that are hard to misread', () => {
    const ref = createOrderRef(new Date(2026, 0, 1));
    expect(ref).toMatch(/^NYL-260101-[A-HJ-NP-Z2-9]{4}$/);
  });

  it('stays in range at the top of the random scale', () => {
    expect(createOrderRef(new Date(2026, 0, 1), () => 0.999999)).toBe('NYL-260101-9999');
  });
});
