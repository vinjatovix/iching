export function getAnalogClockProps(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const phase = 90;
  const hourDegrees = `${(hours / 12) * 360 + (minutes / 60) * 30 + phase}deg`;
  const minuteDegrees = `${(minutes / 60) * 360 + (seconds / 60) * 6 + phase}deg`;
  const secondDegrees = `${(seconds / 60) * 360 + phase}deg`;

  return {
    hourDegrees,
    minuteDegrees,
    secondDegrees,
  };
}
