import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { safeStorage } from './utils/safeStorage';

// We only import the default language synchronously to guarantee the UI can paint immediately
import es from './locales/es.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'gl', name: 'Galego' },
  { code: 'eu', name: 'Euskara' },
  { code: 'ca', name: 'Català' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'ro', name: 'Română' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'cs', name: 'Čeština' },
  { code: 'hu', name: 'Magyar' },
  { code: 'da', name: 'Dansk' },
  { code: 'nb', name: 'Norsk' },
  { code: 'fi', name: 'Suomi' },
];

const savedLanguage = safeStorage.getItem('i18nextLng') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es } // Only load 'es' initially, others are added via localizationService
    },
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    }
  });

// Save language changes back to safeStorage
i18n.on('languageChanged', (lng) => {
  safeStorage.setItem('i18nextLng', lng);
});

export default i18n;
