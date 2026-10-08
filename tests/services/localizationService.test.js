import { describe, it, expect, beforeEach, vi } from 'vitest';
import { localizationService } from '../../src/services/localizationService';
import i18n from '../../src/i18n';

vi.mock('../../src/i18n', () => ({
  default: {
    language: 'es',
    addResourceBundle: vi.fn(),
    changeLanguage: vi.fn().mockResolvedValue(undefined),
    hasResourceBundle: vi.fn().mockReturnValue(false)
  },
  SUPPORTED_LANGUAGES: [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' }
  ]
}));

describe('localizationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localizationService.clearCache();
  });

  describe('loadLocaleBundle', () => {
    it('successfully loads a locale bundle and adds to i18n', async () => {
      // Override the actual import internally for testing
      localizationService.fetchLocale = vi.fn().mockResolvedValue({ "app.title": "I Ching Clock" });
      
      const result = await localizationService.loadLocaleBundle('en');
      
      expect(result).toBe(true);
      expect(i18n.addResourceBundle).toHaveBeenCalledWith('en', 'translation', { "app.title": "I Ching Clock" }, true, true);
    });

    it('throws LOCALE_LOAD_FAILED on error', async () => {
      localizationService.fetchLocale = vi.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(localizationService.loadLocaleBundle('en')).rejects.toThrow('LOCALE_LOAD_FAILED');
    });
  });

  describe('loadHexagramCatalog', () => {
    it('successfully loads hexagram catalog and caches it', async () => {
      const mockCatalog = [{ id: 1, nombre: 'Hex 1' }];
      localizationService.fetchHexagrams = vi.fn().mockResolvedValue(mockCatalog);
      
      const result = await localizationService.loadHexagramCatalog('es');
      
      expect(result).toEqual(mockCatalog);
      expect(localizationService.hexagramCache.has('es')).toBe(true);
    });

    it('throws HEXAGRAM_CATALOG_LOAD_FAILED on error', async () => {
      localizationService.fetchHexagrams = vi.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(localizationService.loadHexagramCatalog('es')).rejects.toThrow('HEXAGRAM_CATALOG_LOAD_FAILED');
    });
  });

  describe('changeLanguageSafely', () => {
    it('successfully changes language and caches state', async () => {
      localizationService.loadLocaleBundle = vi.fn().mockResolvedValue(true);
      localizationService.loadHexagramCatalog = vi.fn().mockResolvedValue([]);
      
      const result = await localizationService.changeLanguageSafely('en');
      
      expect(result).toEqual({ success: true, language: 'en' });
      expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
    });

    it('reverts to previous language on failure', async () => {
      localizationService.loadLocaleBundle = vi.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await localizationService.changeLanguageSafely('en');
      
      expect(result).toEqual({ success: false, error: 'Network error', previousLanguage: 'es' });
      expect(i18n.changeLanguage).not.toHaveBeenCalled();
    });
    
    it('protects against concurrent loads', async () => {
       localizationService.loadLocaleBundle = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
       localizationService.loadHexagramCatalog = vi.fn().mockResolvedValue([]);

       const p1 = localizationService.changeLanguageSafely('en');
       const p2 = localizationService.changeLanguageSafely('es');

       const results = await Promise.all([p1, p2]);
       
       expect(results[1]).toEqual({ success: false, error: 'CONCURRENT_LOAD_IN_PROGRESS', previousLanguage: 'es' });
    });
  });
});
