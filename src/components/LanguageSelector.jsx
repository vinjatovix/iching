import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  // Normalize language code to two characters if e.g. "es-ES"
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="language-selector-wrapper">
      <label htmlFor="language-select" className="sr-only">
        Idioma
      </label>
      <select
        id="language-select"
        className="language-selector"
        value={currentLang}
        onChange={handleChange}
        aria-label="Seleccionar idioma / Select language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <svg
        className="language-selector-arrow"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
