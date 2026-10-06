import { useTranslation } from 'react-i18next';
import { useIChing } from '../../hooks/useIChing';
import { HexagramCard } from './HexagramCard';

export function ReadingResult({ question, reading: initialReading }) {
  const { t } = useTranslation();
  const { reading, primaryHexagram, changingHexagram } = useIChing(question, initialReading);

  if (!reading || !primaryHexagram) {
    return null;
  }

  return (
    <section className="iching-result" aria-label={t('reading.readingFor', { question })}>
      <h3 className="iching-result__question">"{question}"</h3>

      <div className="iching-result__hexagrams">
        <HexagramCard
          title={changingHexagram ? t('reading.initialHexagram') : t('reading.primaryHexagram')}
          hexagram={primaryHexagram}
          character={reading.hexagram.character}
        />

        {changingHexagram && (
          <HexagramCard
            title={t('reading.mutatesTo')}
            hexagram={changingHexagram}
            character={reading.change.to.character}
            isChanging
          />
        )}
      </div>
    </section>
  );
}
