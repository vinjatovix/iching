import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { AnalogClock } from './components/clock/AnalogClock';
import { IChingOracle } from './components/iching/IChingOracle';
import { LanguageSelector } from './components/LanguageSelector';
import { NotificationBanner } from './components/NotificationBanner';
import { localizationService } from './services/localizationService';
import { safeStorage } from './utils/safeStorage';
import './App.css';

const ShanShuiBackground = lazy(() =>
  import('./components/shanshui/ShanShuiBackground').then((m) => ({ default: m.ShanShuiBackground }))
);

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() => safeStorage.getItem('theme') || 'dark');
  const [globalNotification, setGlobalNotification] = useState(null);

  useEffect(() => {
    const activeLang = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];
    if (activeLang !== 'es' && !i18n.hasResourceBundle(activeLang, 'translation')) {
      localizationService.changeLanguageSafely(activeLang);
    }
  }, [i18n]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleNotification = (e) => {
      setGlobalNotification(e.detail);
    };
    window.addEventListener('app-notification', handleNotification);
    return () => window.removeEventListener('app-notification', handleNotification);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <Suspense fallback={<div className="shanshui-container" aria-hidden="true" />}>
        <ShanShuiBackground />
      </Suspense>
      <NotificationBanner notification={globalNotification} />
      <div className="app-container">
        <header className="app-header">
          <LanguageSelector />
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'dark' ? t('app.themeToggleLight') : t('app.themeToggleDark')}
            aria-label={t('app.themeToggleAria')}
          >
            <span className="theme-toggle-icon" aria-hidden="true">☯</span>
            <span className="theme-toggle-label" aria-hidden="true">{theme === 'dark' ? '陽' : '陰'}</span>
          </button>
        </header>

        <main id="main-content" className="app-main">
          <h1 className="sr-only">{t('app.title', 'I Ching Clock')}</h1>
          <AnalogClock />
          <IChingOracle />
        </main>
      </div>
    </>
  );
}

export default App;
