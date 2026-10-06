import { describe, it, expect } from 'vitest';
import { getAnalogClockProps } from '../../src/tools/analogClockProps';

describe('getAnalogClockProps', () => {
  it.each([
    { hours: 0, minutes: 0, seconds: 0, expected: '90deg' },
    { hours: 3, minutes: 0, seconds: 0, expected: '180deg' },
    { hours: 6, minutes: 0, seconds: 0, expected: '270deg' },
    { hours: 12, minutes: 0, seconds: 0, expected: '450deg' },
  ])('calculates correct hour degrees for $hours:00', ({ hours, minutes, seconds, expected }) => {
    const date = new Date(2026, 9, 5, hours, minutes, seconds);

    const result = getAnalogClockProps(date);

    expect(result.hourDegrees).toBe(expected);
  });

  it.each([
    { minutes: 0, seconds: 0, expected: '90deg' },
    { minutes: 15, seconds: 0, expected: '180deg' },
    { minutes: 30, seconds: 0, expected: '270deg' },
    { minutes: 45, seconds: 0, expected: '360deg' },
  ])('calculates correct minute degrees for $minutes minutes', ({ minutes, seconds, expected }) => {
    const date = new Date(2026, 9, 5, 0, minutes, seconds);

    const result = getAnalogClockProps(date);

    expect(result.minuteDegrees).toBe(expected);
  });

  it.each([
    { seconds: 0, expected: '90deg' },
    { seconds: 15, expected: '180deg' },
    { seconds: 30, expected: '270deg' },
    { seconds: 45, expected: '360deg' },
  ])('calculates correct second degrees for $seconds seconds', ({ seconds, expected }) => {
    const date = new Date(2026, 9, 5, 0, 0, seconds);

    const result = getAnalogClockProps(date);

    expect(result.secondDegrees).toBe(expected);
  });

  it('calculates expected rotation degrees for 3:30:30', () => {
    const date = new Date(2026, 9, 5, 3, 30, 30);

    const result = getAnalogClockProps(date);

    expect(result.hourDegrees).toBe('195deg');
    expect(result.minuteDegrees).toBe('273deg');
    expect(result.secondDegrees).toBe('270deg');
  });
});
