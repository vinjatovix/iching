import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionForm } from './QuestionForm';
import '../../styles/IChing.css';

const ReadingResult = lazy(() =>
  import('./ReadingResult').then((m) => ({ default: m.ReadingResult }))
);

export function IChingOracle() {
  const { t } = useTranslation();
  const [consultations, setConsultations] = useState([]);

  const handleAsk = (newQuestion) => {
    setConsultations((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        question: newQuestion,
      },
      ...prev,
    ]);
  };

  const handleClear = () => {
    setConsultations([]);
  };

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

        <QuestionForm onAsk={handleAsk} />
      </div>

      {consultations.length > 0 && (
        <div className="iching-oracle__actions">
          <button 
            type="button" 
            className="iching-oracle__clear-button" 
            onClick={handleClear}
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
        {consultations.map((item) => (
          <Suspense
            key={item.id}
            fallback={<div className="iching-result--loading">{t('oracle.loading')}</div>}
          >
            <ReadingResult question={item.question} />
          </Suspense>
        ))}
      </div>
    </section>
  );
}
