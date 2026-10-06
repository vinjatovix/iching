import { useTranslation } from 'react-i18next';
import { useAnalogClock } from '../../hooks/useAnalogClock';
import { Needle } from './Needle';
import '../../styles/AnalogClock.css';

export function AnalogClock() {
  const { t } = useTranslation();
  const {
    hourDegrees,
    minuteDegrees,
    secondDegrees,
    timeString,
  } = useAnalogClock();

  return (
    <div
      role="img"
      className="analog-clock"
      aria-label={timeString ? `${t('clock.ariaLabel')}: ${timeString}` : t('clock.ariaLabel')}
    >
      <span className="sr-only">
        {t('clock.currentTime')} <time>{timeString}</time>
      </span>
      <div className="analog-clock-body" aria-hidden="true">
        <Needle type="analog-hours" degrees={hourDegrees} />
        <Needle type="analog-minutes" degrees={minuteDegrees} />
        <Needle type="analog-seconds" degrees={secondDegrees} color="var(--accent-red)" />
        <div className="analog-clock-center" />
      </div>
    </div>
  );
}
