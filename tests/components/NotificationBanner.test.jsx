import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationBanner } from '../../src/components/NotificationBanner';

describe('NotificationBanner component', () => {
  it('renders polite notification correctly in persistent status region', () => {
    const notification = {
      id: '1',
      message: 'History cleared',
      politeness: 'polite',
      timestamp: Date.now()
    };

    render(<NotificationBanner notification={notification} />);
    
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent('History cleared');
    expect(banner).toHaveAttribute('aria-live', 'polite');
    expect(banner).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders assertive notification correctly in persistent alert region', () => {
    const notification = {
      id: '2',
      message: 'Network error',
      politeness: 'assertive',
      timestamp: Date.now()
    };

    render(<NotificationBanner notification={notification} />);
    
    const banner = screen.getByRole('alert');
    expect(banner).toHaveTextContent('Network error');
    expect(banner).toHaveAttribute('aria-live', 'assertive');
    expect(banner).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders empty live regions when no notification is provided', () => {
    render(<NotificationBanner notification={null} />);
    
    const alert = screen.getByRole('alert');
    const status = screen.getByRole('status');
    expect(alert).toHaveTextContent('');
    expect(status).toHaveTextContent('');
  });
});
