import { useState, useEffect, useRef } from 'react';
import { getAnalogClockProps } from '../tools/analogClockProps';

function getNextClockwiseAngle(prevAngle, targetAngle) {
  const diff = (targetAngle - (prevAngle % 360) + 360) % 360;
  return prevAngle + diff;
}

export function useAnalogClock() {
  const [clockProps, setClockProps] = useState(() => {
    const now = new Date();
    return {
      ...getAnalogClockProps(now),
      timeString: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  });
  const anglesRef = useRef(null);

  useEffect(() => {
    const initial = getAnalogClockProps(new Date());
    anglesRef.current = {
      second: parseFloat(initial.secondDegrees),
      minute: parseFloat(initial.minuteDegrees),
      hour: parseFloat(initial.hourDegrees),
    };

    const interval = setInterval(() => {
      const now = new Date();
      const raw = getAnalogClockProps(now);

      const targetSecond = parseFloat(raw.secondDegrees);
      const targetMinute = parseFloat(raw.minuteDegrees);
      const targetHour = parseFloat(raw.hourDegrees);

      const nextSecond = getNextClockwiseAngle(anglesRef.current.second, targetSecond);
      const nextMinute = getNextClockwiseAngle(anglesRef.current.minute, targetMinute);
      const nextHour = getNextClockwiseAngle(anglesRef.current.hour, targetHour);

      anglesRef.current = {
        second: nextSecond,
        minute: nextMinute,
        hour: nextHour,
      };

      setClockProps({
        secondDegrees: `${nextSecond}deg`,
        minuteDegrees: `${nextMinute}deg`,
        hourDegrees: `${nextHour}deg`,
        timeString: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return clockProps;
}
