import { describe, expect, it } from 'vitest';
import type { Perfume } from '../../types';
import type { PricedLine } from '../cart/cartTotals';
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

const line = (
  name: string,
  size: PricedLine['size'],
  quantity: number,
  unitPrice: number,
): PricedLine => ({
  perfumeId: name,
  perfume: perfumeNamed(name),
  size,
  quantity,
  unitPrice,
  lineTotal: unitPrice * quantity,
});

const cart: OrderCart = {
  lines: [line('Oud Noir', 50, 2, 3200), line('Rose Atelier', 30, 1, 1800)],
  itemCount: 3,
  subtotal: 8200,
  shipping: 0,
  total: 8200,
};

const fullCustomer: Customer = {
  name: 'Asha Menon',
  phone: '9876543210',
  email: 'asha@example.com',
  addressLine1: '12 MG Road',
  addressLine2: 'Near the old library',
  city: 'Kochi',
  state: 'Kerala',
  pin: '682016',
  notes: 'Make it less sweet',
};

const requiredOnly: Customer = { ...fullCustomer, email: '', addressLine2: '', notes: '' };

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
      { lines: [line('Kaapi', 30, 1, 1600)], itemCount: 1, subtotal: 1600, shipping: 150, total: 1750 },
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
