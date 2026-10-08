import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionForm } from './QuestionForm';
import { useOracle } from '../../hooks/useOracle';
import '../../styles/IChing.css';

const ReadingResult = lazy(() =>
  import('./ReadingResult').then((m) => ({ default: m.ReadingResult }))
);

export function IChingOracle() {
  const { t } = useTranslation();
  const { consultations, askQuestion, clearHistory } = useOracle();

  return (
    <section className="iching-oracle">
      <div className="iching-oracle__card">
        <header className="iching-oracle__header">
          <h2 className="iching-oracle__title">{t('oracle.title')}</h2>
          <p className="iching-oracle__subtitle">
            {t('oracle.subtitle')}
          </p>
          <p className="iching-oracle__note">
            {t('oracle.note')}
          </p>
        </header>

        <QuestionForm onAsk={askQuestion} />
      </div>

      {consultations.length > 0 && (
        <div className="iching-oracle__actions">
          <button 
            type="button" 
            className="iching-oracle__clear-button" 
            onClick={clearHistory}
          >
            {t('oracle.clearReadings')}
          </button>
        </div>
      )}

      <div
        className="iching-oracle__history"
        role="region"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={t('oracle.historyAria')}
      >
        {consultations.length > 0 && (
          <h3 className="sr-only">{t('oracle.historyTitle', 'Consultation History')}</h3>
        )}
        {consultations.map((item) => (
          <Suspense
            key={item.id}
            fallback={<div className="iching-result--loading">{t('oracle.loading')}</div>}
          >
            <ReadingResult question={item.question} reading={item.rawReading} />
          </Suspense>
        ))}
      </div>
    </section>
  );
}