import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalogClock } from '../../../src/components/clock/AnalogClock';

describe('AnalogClock', () => {
  it('renders analog clock with img role and accessibility label', () => {
    render(<AnalogClock />);

    const clockElement = screen.getByRole('img', { name: /reloj analógico/i });

    expect(clockElement).toBeInTheDocument();
  });

  it('renders accessible time element for screen readers', () => {
    const { container } = render(<AnalogClock />);

    const timeElement = container.querySelector('time');

    expect(timeElement).toBeInTheDocument();
    expect(timeElement?.textContent).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  it('hides visual clock needles from assistive technology', () => {
    const { container } = render(<AnalogClock />);

    const needlesContainer = container.querySelector('.analog-clock-body');

    expect(needlesContainer).toHaveAttribute('aria-hidden', 'true');
  });
});
