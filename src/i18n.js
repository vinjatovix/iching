import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import gl from './locales/gl.json';
import eu from './locales/eu.json';
import ca from './locales/ca.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ro from './locales/ro.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import el from './locales/el.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import sv from './locales/sv.json';

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
];

const resources = {
  es: { translation: es },
  gl: { translation: gl },
  eu: { translation: eu },
  ca: { translation: ca },
  en: { translation: en },
  fr: { translation: fr },
  it: { translation: it },
  ro: { translation: ro },
  pt: { translation: pt },
  de: { translation: de },
  el: { translation: el },
  nl: { translation: nl },
  pl: { translation: pl },
  sv: { translation: sv },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
