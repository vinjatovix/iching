import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReadingResult } from '../../../src/components/iching/ReadingResult';

// Mock hook
vi.mock('../../../src/hooks/useIChing', () => ({
  useIChing: () => ({
    reading: { hexagram: { character: '䷀' }, change: { to: { character: '䷁' } } },
    primaryHexagram: { id: 1, nombre: 'El Creador' },
    changingHexagram: { id: 2, nombre: 'Lo Receptivo' }
  })
}));

// Mock Translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

// Mock HexagramCard to test its props
vi.mock('../../../src/components/iching/HexagramCard', () => ({
  HexagramCard: ({ title }) => <div data-testid="hexagram-card">{title}</div>
}));

describe('ReadingResult component', () => {
  it('renders consultation question as H4 to maintain hierarchy under H3 history landmark', () => {
    render(<ReadingResult question="Should I refactor?" reading={{}} />);
    
    const questionHeading = screen.getByRole('heading', { level: 4, name: '"Should I refactor?"' });
    expect(questionHeading).toHaveClass('iching-result__question');
    expect(questionHeading).toBeInTheDocument();
  });

  it('renders both primary and changing hexagram cards when change exists', () => {
    render(<ReadingResult question="Should I refactor?" reading={{}} />);
    
    const cards = screen.getAllByTestId('hexagram-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('reading.initialHexagram');
    expect(cards[1]).toHaveTextContent('reading.mutatesTo');
  });
});
