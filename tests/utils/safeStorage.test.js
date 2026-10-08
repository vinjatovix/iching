import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeStorage } from '../../src/utils/safeStorage';

describe('safeStorage utility', () => {
  beforeEach(() => {
    window.localStorage.clear();
    safeStorage.clearMemory();
    vi.restoreAllMocks();
  });

  describe('localStorage operations', () => {
    it('sets and gets item successfully from localStorage', () => {
      safeStorage.setItem('theme', 'light');
      expect(safeStorage.getItem('theme')).toBe('light');
      expect(window.localStorage.getItem('theme')).toBe('light');
    });

    it('removes item successfully from localStorage', () => {
      safeStorage.setItem('theme', 'dark');
      safeStorage.removeItem('theme');
      expect(safeStorage.getItem('theme')).toBe(null);
      expect(window.localStorage.getItem('theme')).toBe(null);
    });
  });

  describe('in-memory fallback operations', () => {
    beforeEach(() => {
      vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
    });

    it('falls back to in-memory store when localStorage throws on setItem', () => {
      safeStorage.setItem('language', 'gl');
      expect(safeStorage.getItem('language')).toBe('gl');
    });

    it('removes item successfully from in-memory store', () => {
      safeStorage.setItem('language', 'eu');
      safeStorage.removeItem('language');
      expect(safeStorage.getItem('language')).toBe(null);
    });
  });

  describe('parameterized value constraints', () => {
    describe('theme constraints', () => {
      it.each([
        { value: 'light', expected: 'light' },
        { value: 'dark', expected: 'dark' },
        { value: 'invalid', expected: 'dark' } // defaults to dark if invalid
      ])('enforces theme=$value', ({ value, expected }) => {
        safeStorage.setItem('theme', value);
        expect(safeStorage.getItem('theme')).toBe(expected);
      });
    });

    describe('language constraints', () => {
      it.each([
        { value: 'es', expected: 'es' },
        { value: 'gl', expected: 'gl' },
        { value: 'en', expected: 'en' },
        { value: 'invalid', expected: 'es' } // defaults to es if invalid
      ])('enforces language=$value', ({ value, expected }) => {
        safeStorage.setItem('i18nextLng', value);
        expect(safeStorage.getItem('i18nextLng')).toBe(expected);
      });
    });
  });
});
