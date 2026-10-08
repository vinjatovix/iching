const SUPPORTED_LANGUAGES = [
  'es', 'gl', 'eu', 'ca', 'en', 'fr', 'it', 'ro', 'pt', 'de', 'el', 'nl', 'pl', 'sv',
  'ru', 'uk', 'tr', 'cs', 'hu', 'da', 'nb', 'fi'
];
const SUPPORTED_THEMES = ['light', 'dark'];

class SafeStorage {
  constructor() {
    this.memoryStore = new Map();
  }

  isStorageAvailable() {
    try {
      const test = '__test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  validateValue(key, value) {
    if (value === null) return null;
    if (key === 'theme') {
      return SUPPORTED_THEMES.includes(value) ? value : 'dark';
    }
    if (key === 'i18nextLng' || key === 'language') {
      return SUPPORTED_LANGUAGES.includes(value) ? value : 'es';
    }
    return value;
  }

  setItem(key, value) {
    const validatedValue = this.validateValue(key, value);
    try {
      window.localStorage.setItem(key, validatedValue);
      this.memoryStore.delete(key);
    } catch {
      this.memoryStore.set(key, validatedValue);
    }
  }

  getItem(key) {
    let value = null;
    try {
      value = window.localStorage.getItem(key);
    } catch {
      // Ignore
    }

    if (value === null && this.memoryStore.has(key)) {
      value = this.memoryStore.get(key);
    }

    return this.validateValue(key, value);
  }

  removeItem(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
    this.memoryStore.delete(key);
  }

  clearMemory() {
    this.memoryStore.clear();
  }
}

export const safeStorage = new SafeStorage();
