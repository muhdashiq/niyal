type StorageArea = 'localStorage' | 'sessionStorage';

// Storage can be missing or blocked, in private windows or when the disk is full,
// so none of these may throw. The caller validates whatever comes back.
export const readStorage = (key: string, area: StorageArea = 'localStorage'): unknown => {
  try {
    const stored = window[area].getItem(key);
    return stored === null ? null : JSON.parse(stored);
  } catch {
    return null;
  }
};

export const writeStorage = (key: string, value: unknown, area: StorageArea = 'localStorage') => {
  try {
    window[area].setItem(key, JSON.stringify(value));
  } catch {
    // Nothing to do. The data simply won't outlast this visit.
  }
};

export const removeStorage = (key: string, area: StorageArea = 'localStorage') => {
  try {
    window[area].removeItem(key);
  } catch {
    // Nothing to do. There was nowhere to remove it from.
  }
};
