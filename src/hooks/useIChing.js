import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import iChing from 'i-ching';

import hexagramsEs from '../db/hexagrams_es.json';
import hexagramsGl from '../db/hexagrams_gl.json';
import hexagramsEu from '../db/hexagrams_eu.json';
import hexagramsCa from '../db/hexagrams_ca.json';
import hexagramsEn from '../db/hexagrams_en.json';
import hexagramsFr from '../db/hexagrams_fr.json';
import hexagramsIt from '../db/hexagrams_it.json';
import hexagramsRo from '../db/hexagrams_ro.json';
import hexagramsPt from '../db/hexagrams_pt.json';
import hexagramsDe from '../db/hexagrams_de.json';
import hexagramsEl from '../db/hexagrams_el.json';
import hexagramsNl from '../db/hexagrams_nl.json';
import hexagramsPl from '../db/hexagrams_pl.json';
import hexagramsSv from '../db/hexagrams_sv.json';

const HEXAGRAMS_MAP = {
  es: hexagramsEs,
  gl: hexagramsGl,
  eu: hexagramsEu,
  ca: hexagramsCa,
  en: hexagramsEn,
  fr: hexagramsFr,
  it: hexagramsIt,
  ro: hexagramsRo,
  pt: hexagramsPt,
  de: hexagramsDe,
  el: hexagramsEl,
  nl: hexagramsNl,
  pl: hexagramsPl,
  sv: hexagramsSv,
};

export function useIChing(question, initialReading = null) {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];
  const currentHexagrams = HEXAGRAMS_MAP[lang] || hexagramsEs;

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
