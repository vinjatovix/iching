import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HexagramCard } from '../../../src/components/iching/HexagramCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

const mockHexagram = {
  id: 1,
  nombre: 'El Creador',
  trigramas: { superior: 'Cielo', inferior: 'Cielo' },
  juicio: 'Juicio text',
  imagen: 'Imagen text'
};

describe('HexagramCard component', () => {
  it('renders hexagram name as h5 and sections as h6 for unbroken heading hierarchy', () => {
    render(<HexagramCard title="Primary" hexagram={mockHexagram} character="䷀" />);
    
    const title = screen.getByRole('heading', { level: 5, name: 'El Creador' });
    expect(title).toBeInTheDocument();

    const judgmentSection = screen.getByRole('heading', { level: 6, name: 'card.judgment' });
    expect(judgmentSection).toBeInTheDocument();
    
    const imageSection = screen.getByRole('heading', { level: 6, name: 'card.image' });
    expect(imageSection).toBeInTheDocument();
  });

  it('renders semantic badge via p tag rather than heading tags', () => {
    const { container } = render(<HexagramCard title="Primary Hexagram" hexagram={mockHexagram} character="䷀" />);
    const badge = container.querySelector('.hexagram-card__badge');
    expect(badge.tagName.toLowerCase()).toBe('p');
    expect(badge).toHaveTextContent('Primary Hexagram');
  });

  it('sets aria-hidden="true" on hexagram symbol element', () => {
    const { container } = render(<HexagramCard title="Primary" hexagram={mockHexagram} character="䷀" />);
    const symbol = container.querySelector('.hexagram-card__symbol');
    expect(symbol).toHaveAttribute('aria-hidden', 'true');
    expect(symbol).toHaveTextContent('䷀');
  });
});
