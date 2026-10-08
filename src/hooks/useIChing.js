import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import iChing from 'i-ching';
import { localizationService } from '../services/localizationService';

// Fallback synchronous load to guarantee fast initial render for 'es'
import hexagramsEs from '../db/hexagrams_es.json';

export function useIChing(question, initialReading = null) {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];
  
  const [asyncHexagrams, setAsyncHexagrams] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if (!localizationService.hexagramCache.has(lang)) {
      localizationService.loadHexagramCatalog(lang).then((data) => {
        if (!isCancelled) {
          setAsyncHexagrams(data);
        }
      }).catch(() => {
        if (!isCancelled) {
          setAsyncHexagrams(localizationService.hexagramCache.get('es') || hexagramsEs);
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [lang]);

  const currentHexagrams = localizationService.hexagramCache.get(lang) || asyncHexagrams || hexagramsEs;

  const [prevQuestion, setPrevQuestion] = useState(question);
  const [reading, setReading] = useState(() => {
    if (initialReading) return initialReading;
    if (!question) return null;
    try {
      return iChing.ask(question);
    } catch (error) {
      console.error('Failed to get I-Ching reading:', error);
      return null;
    }
  });

  if (question !== prevQuestion) {
    setPrevQuestion(question);
    if (initialReading) {
      setReading(initialReading);
    } else if (question) {
      try {
        setReading(iChing.ask(question));
      } catch (error) {
        console.error('Failed to get I-Ching reading:', error);
        setReading(null);
      }
    } else {
      setReading(null);
    }
  }

  return useMemo(() => {
    if (!reading) {
      return {
        reading: null,
        primaryHexagram: null,
        changingHexagram: null,
      };
    }

    const primaryHexagram = currentHexagrams.find((item) => item.id === reading.hexagram.number);
    const changingHexagram = reading.change
      ? currentHexagrams.find((item) => item.id === reading.change.to.number)
      : null;

    return {
      reading,
      primaryHexagram,
      changingHexagram,
    };
  }, [reading, currentHexagrams]);
}
