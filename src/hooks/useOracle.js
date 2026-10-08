import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import iChing from 'i-ching';

export function useOracle() {
  const { t } = useTranslation();
  const [consultations, setConsultations] = useState([]);
  const [error, setError] = useState(null);

  const askQuestion = useCallback((question) => {
    const trimmed = question.trim();
    if (trimmed.length === 0) {
      const err = t('form.errorRequired', 'Question cannot be empty');
      setError(err);
      return false;
    }
    if (trimmed.length > 500) {
      const err = t('form.errorLength', 'Question is too long');
      setError(err);
      return false;
    }
    
    setError(null);
    let reading;
    
    try {
      reading = iChing.ask(trimmed);
    } catch (e) {
      console.error('[useOracle] Error consulting the I Ching:', e);
      const err = t('oracle.error', 'Could not consult the oracle at this time. Please try again.');
      setError(err);
      return false;
    }

    const consultation = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      question: trimmed,
      rawReading: reading,
      primaryHexagramId: reading.hexagram.number,
      changingHexagramId: reading.change ? reading.change.to.number : null
    };

    setConsultations((prev) => [consultation, ...prev]);

    const event = new CustomEvent('app-notification', {
      detail: {
        id: Date.now().toString(),
        message: t('reading.readingGenerated', {
          defaultValue: `Reading generated for: "${trimmed}". Hexagram #${reading.hexagram.number}`,
          question: trimmed,
          hexagram: reading.hexagram.number
        }),
        politeness: 'polite',
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);

    return true;
  }, [t]);

  const clearHistory = useCallback(() => {
    setConsultations([]);
    const event = new CustomEvent('app-notification', {
      detail: {
        id: Date.now().toString(),
        message: t('oracle.clearConfirmation', 'History cleared'),
        politeness: 'polite',
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  }, [t]);

  return {
    consultations,
    error,
    askQuestion,
    clearHistory
  };
}
