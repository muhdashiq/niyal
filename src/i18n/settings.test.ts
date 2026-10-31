import { describe, expect, it } from 'vitest';
import {
  currencyForCountry,
  detectCountry,
  detectLanguage,
  type LocaleSettings,
  parseStoredSettings,
} from './settings';

describe('detectLanguage', () => {
  it('takes the first language the site offers', () => {
    expect(detectLanguage(['fr-FR', 'ml-IN', 'en-IN'])).toBe('ml');
    expect(detectLanguage(['zh-TW'])).toBe('zh');
  });

  it('falls back to English', () => {
    expect(detectLanguage(['fr-FR'])).toBe('en');
    expect(detectLanguage([])).toBe('en');
  });
});

describe('detectCountry', () => {
  it('trusts the time zone over an en-US browser', () => {
    expect(detectCountry('Asia/Kolkata', ['en-US'])).toBe('IN');
    expect(detectCountry('Asia/Dubai', ['en-US'])).toBe('AE');
  });

  it('uses the browser region for other zones', () => {
    expect(detectCountry('America/New_York', ['en-US'])).toBe('US');
    expect(detectCountry('Europe/Madrid', ['es-ES'])).toBe('ES');
  });

  it('falls back to India when nothing says otherwise', () => {
    expect(detectCountry('Mars/Base', ['en'])).toBe('IN');
    expect(detectCountry('Mars/Base', ['xx-ZZ'])).toBe('IN');
  });
});

describe('currencyForCountry', () => {
  it('maps each offered currency to its country', () => {
    expect(currencyForCountry('IN')).toBe('INR');
    expect(currencyForCountry('KW')).toBe('KWD');
    expect(currencyForCountry('DE')).toBe('EUR');
    expect(currencyForCountry('GB')).toBe('GBP');
  });

  it('uses dollars where the local currency is not offered', () => {
    expect(currencyForCountry('JP')).toBe('USD');
  });
});

describe('parseStoredSettings', () => {
  const detected: LocaleSettings = { language: 'en', currency: 'INR', country: 'IN' };

  it('keeps valid saved choices', () => {
    const saved = { language: 'ar', currency: 'AED', country: 'AE' };
    expect(parseStoredSettings(saved, detected)).toEqual(saved);
  });

  it('replaces anything it does not recognise with what was detected', () => {
    expect(parseStoredSettings({ language: 'xx', currency: 'BTC', country: 'ZZ' }, detected)).toEqual(detected);
    expect(parseStoredSettings(null, detected)).toEqual(detected);
    expect(parseStoredSettings('text', detected)).toEqual(detected);
  });
});
