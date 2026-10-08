import i18n from '../i18n';

class LocalizationService {
  constructor() {
    this.hexagramCache = new Map();
    this.isChanging = false;
    this.supportedLanguages = [
      'es', 'gl', 'eu', 'ca', 'en', 'fr', 'it', 'ro', 'pt', 'de', 'el', 'nl', 'pl', 'sv',
      'ru', 'uk', 'tr', 'cs', 'hu', 'da', 'nb', 'fi'
    ];
  }

  clearCache() {
    this.hexagramCache.clear();
    this.isChanging = false;
  }

  getValidatedLanguage(lang) {
    return this.supportedLanguages.includes(lang) ? lang : 'es';
  }

  // Seam for testing
  async fetchLocale(lang) {
    const module = await import(`../locales/${lang}.json`);
    return module.default || module;
  }

  // Seam for testing
  async fetchHexagrams(lang) {
    const module = await import(`../db/hexagrams_${lang}.json`);
    // Validation constraint: check if it's an array and has at least one valid item
    const data = module.default || module;
    if (!Array.isArray(data) || data.length !== 64 || !data[0].nombre) {
        throw new Error('Invalid Hexagram Catalog Format');
    }
    return data;
  }

  async loadLocaleBundle(lang) {
    try {
      if (i18n.hasResourceBundle(lang, 'translation')) {
        return true;
      }
      const data = await this.fetchLocale(lang);
      i18n.addResourceBundle(lang, 'translation', data, true, true);
      return true;
    } catch (error) {
      throw new Error('LOCALE_LOAD_FAILED', { cause: error });
    }
  }

  async loadHexagramCatalog(lang) {
    if (this.hexagramCache.has(lang)) {
      return this.hexagramCache.get(lang);
    }

    try {
      const data = await this.fetchHexagrams(lang);
      this.hexagramCache.set(lang, data);
      return data;
    } catch (error) {
      throw new Error('HEXAGRAM_CATALOG_LOAD_FAILED', { cause: error });
    }
  }

  async changeLanguageSafely(lang) {
    const targetLang = this.getValidatedLanguage(lang);
    const previousLanguage = i18n.language || 'es';

    if (this.isChanging) {
      return { success: false, error: 'CONCURRENT_LOAD_IN_PROGRESS', previousLanguage };
    }

    if (targetLang === previousLanguage) {
      return { success: true, language: targetLang };
    }

    this.isChanging = true;

    try {
      await Promise.all([
        this.loadLocaleBundle(targetLang),
        this.loadHexagramCatalog(targetLang)
      ]);

      await i18n.changeLanguage(targetLang);
      
      this.isChanging = false;
      return { success: true, language: targetLang };
    } catch (error) {
      this.isChanging = false;
      return { 
        success: false, 
        error: error.message,
        previousLanguage 
      };
    }
  }
}

export const localizationService = new LocalizationService();