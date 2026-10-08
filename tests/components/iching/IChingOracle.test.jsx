import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { IChingOracle } from '../../../src/components/iching/IChingOracle';
import { useOracle } from '../../../src/hooks/useOracle';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

vi.mock('../../../src/hooks/useOracle', () => ({
  useOracle: vi.fn()
}));

// Mock QuestionForm and ReadingResult for isolated testing
vi.mock('../../../src/components/iching/QuestionForm', () => ({
  QuestionForm: ({ onAsk }) => (
    <button data-testid="mock-ask" onClick={() => onAsk('Test question')}>Ask</button>
  )
}));

vi.mock('../../../src/components/iching/ReadingResult', () => ({
  ReadingResult: ({ question }) => <div data-testid="mock-result">{question}</div>
}));

describe('IChingOracle component', () => {
  it('renders consultation history correctly from useOracle state', async () => {
    useOracle.mockReturnValue({
      consultations: [{ id: '1', question: 'Test question 1', rawReading: {} }],
      askQuestion: vi.fn(),
      clearHistory: vi.fn()
    });

    render(<IChingOracle />);
    
    const results = await screen.findAllByTestId('mock-result');
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveTextContent('Test question 1');
  });

  it('triggers clearHistory when clear button is clicked', async () => {
    const clearHistoryMock = vi.fn();
    useOracle.mockReturnValue({
      consultations: [{ id: '1', question: 'Test question 1' }],
      askQuestion: vi.fn(),
      clearHistory: clearHistoryMock
    });

    render(<IChingOracle />);
    
    const clearButton = screen.getByRole('button', { name: 'oracle.clearReadings' });
    await userEvent.click(clearButton);
    
    expect(clearHistoryMock).toHaveBeenCalledTimes(1);
  });

  it('triggers askQuestion when form submits', async () => {
    const askQuestionMock = vi.fn();
    useOracle.mockReturnValue({
      consultations: [],
      askQuestion: askQuestionMock,
      clearHistory: vi.fn()
    });

    render(<IChingOracle />);
    
    const askButton = screen.getByTestId('mock-ask');
    await userEvent.click(askButton);
    
    expect(askQuestionMock).toHaveBeenCalledWith('Test question');
  });
});
