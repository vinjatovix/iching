import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { AnalogClock } from './components/clock/AnalogClock';
import { IChingOracle } from './components/iching/IChingOracle';
import { LanguageSelector } from './components/LanguageSelector';
import './App.css';

const ShanShuiBackground = lazy(() =>
  import('./components/shanshui/ShanShuiBackground').then((m) => ({ default: m.ShanShuiBackground }))
);

function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore in environments with restricted storage
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <Suspense fallback={<div className="shanshui-container" aria-hidden="true" />}>
        <ShanShuiBackground />
      </Suspense>
      <div className="app-container">
        <header className="app-header">
          <LanguageSelector />
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'dark' ? t('app.themeToggleLight') : t('app.themeToggleDark')}
            aria-label={t('app.themeToggleAria')}
          >
            <span className="theme-toggle-icon">☯</span>
            <span className="theme-toggle-label">{theme === 'dark' ? '陽' : '陰'}</span>
          </button>
        </header>

        <main className="app-main">
          <AnalogClock />
          <IChingOracle />
        </main>
      </div>
    </>
  );
}

export default App;
