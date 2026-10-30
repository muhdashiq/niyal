import { afterEach, describe, expect, it, vi } from 'vitest';
import { readStorage, writeStorage } from './storage';

const blockedStorage = {
  getItem: () => {
    throw new Error('Storage is blocked');
  },
  setItem: () => {
    throw new Error('Storage is full');
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('storage', () => {
  it('reads as nothing, rather than throwing, when storage is blocked', () => {
    vi.stubGlobal('window', { localStorage: blockedStorage });
    expect(readStorage('key')).toBeNull();
  });

  it('ignores a failed write, rather than throwing', () => {
    vi.stubGlobal('window', { localStorage: blockedStorage });
    expect(() => writeStorage('key', [])).not.toThrow();
  });

  it('reads as nothing when the saved text is not valid JSON', () => {
    vi.stubGlobal('window', { localStorage: { getItem: () => '{not json' } });
    expect(readStorage('key')).toBeNull();
  });
});
