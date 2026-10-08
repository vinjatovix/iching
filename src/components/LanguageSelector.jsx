import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { localizationService } from '../services/localizationService';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isPending, setIsPending] = useState(false);

  const currentLang = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];

  const handleChange = async (e) => {
    const targetLang = e.target.value;
    setIsPending(true);
    
    const result = await localizationService.changeLanguageSafely(targetLang);
    setIsPending(false);
    
    if (!result.success) {
      if (result.error === 'CONCURRENT_LOAD_IN_PROGRESS') return;

      const event = new CustomEvent('app-notification', {
        detail: {
          id: Date.now().toString(),
          message: t('notifications.localeLoadError', 'Could not load language data. Please check your connection.'),
          politeness: 'assertive',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    }
  };

  const selectLabel = t('languages.selectLanguage', 'Seleccionar idioma');

  return (
    <div className="language-selector-wrapper">
      <label htmlFor="language-select" className="sr-only">
        {selectLabel}
      </label>
      <select
        id="language-select"
        className="language-selector"
        value={currentLang}
        onChange={handleChange}
        disabled={isPending}
        aria-label={selectLabel}
        aria-busy={isPending}
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
