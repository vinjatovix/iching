import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnalogClock } from '../../../src/components/clock/AnalogClock';

// Mock hook
vi.mock('../../../src/hooks/useAnalogClock', () => ({
  useAnalogClock: () => ({
    hourDegrees: 90,
    minuteDegrees: 180,
    secondDegrees: 270,
    timeString: '3:30:45 PM'
  })
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const keys = {
        'clock.ariaLabel': 'Analog clock',
        'clock.currentTime': 'Current time:'
      };
      return keys[key] || key;
    }
  })
}));

describe('AnalogClock component', () => {
  it('renders clock with correct aria-label and role', () => {
    render(<AnalogClock />);
    const clock = screen.getByRole('img', { name: 'Analog clock: 3:30:45 PM' });
    expect(clock).toBeInTheDocument();
  });

  it('renders visually hidden time string for screen readers', () => {
    render(<AnalogClock />);
    const hiddenText = screen.getByText('Current time:');
    expect(hiddenText).toHaveClass('sr-only');
    const timeElement = screen.getByText('3:30:45 PM');
    expect(timeElement.tagName.toLowerCase()).toBe('time');
    expect(timeElement.parentElement).toHaveClass('sr-only');
  });

  it('hides decorative clock body from assistive technology', () => {
    const { container } = render(<AnalogClock />);
    const clockBody = container.querySelector('.analog-clock-body');
    expect(clockBody).toHaveAttribute('aria-hidden', 'true');
  });
});
