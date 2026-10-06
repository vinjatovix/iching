import { useTranslation } from 'react-i18next';

export function HexagramCard({ title, hexagram, character, isChanging = false }) {
  const { t } = useTranslation();

  if (!hexagram) return null;

  const hexLabel = t('card.hexagram');
  const ariaLabel = `${title ? `${title}: ` : ''}${hexLabel} ${hexagram.id} - ${hexagram.nombre}`;

  return (
    <article
      className={`hexagram-card ${isChanging ? 'hexagram-card--changing' : ''}`}
      aria-label={ariaLabel}
    >
      {title && <h3 className="hexagram-card__badge">{title}</h3>}
      <div className="hexagram-card__header">
        <span className="hexagram-card__symbol" aria-hidden="true">{character}</span>
        <div className="hexagram-card__meta">
          <span className="hexagram-card__number">#{hexagram.id}</span>
          <h2 className="hexagram-card__name">{hexagram.nombre}</h2>
        </div>
      </div>

      {hexagram.trigramas && (
        <div className="hexagram-card__trigrams">
          <p><strong>{t('card.superior')}:</strong> {hexagram.trigramas.superior}</p>
          <p><strong>{t('card.inferior')}:</strong> {hexagram.trigramas.inferior}</p>
        </div>
      )}

      <div className="hexagram-card__section">
        <h4>{t('card.judgment')}</h4>
        <p>{hexagram.juicio}</p>
      </div>

      {hexagram.imagen && (
        <div className="hexagram-card__section">
          <h4>{t('card.image')}</h4>
          <p>{hexagram.imagen}</p>
        </div>
      )}
    </article>
  );
}
