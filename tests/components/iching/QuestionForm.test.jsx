import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QuestionForm } from '../../../src/components/iching/QuestionForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

describe('QuestionForm component', () => {
  it('triggers onAsk when submitting valid input and retains focus on input', async () => {
    const onAsk = vi.fn().mockReturnValue(true);
    render(<QuestionForm onAsk={onAsk} />);
    
    const input = screen.getByPlaceholderText('form.placeholder');
    const button = screen.getByRole('button', { name: 'form.submit' });
    
    await userEvent.type(input, 'Valid question?');
    await userEvent.click(button);
    
    expect(onAsk).toHaveBeenCalledWith('Valid question?');
    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('rejects empty input without calling onAsk and displays accessible error', async () => {
    const onAsk = vi.fn();
    const { container } = render(<QuestionForm onAsk={onAsk} />);
    
    const input = screen.getByPlaceholderText('form.placeholder');
    const button = screen.getByRole('button', { name: 'form.submit' });
    
    await userEvent.click(button);
    
    expect(onAsk).not.toHaveBeenCalled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'question-error');
    
    const error = container.querySelector('#question-error');
    expect(error).toBeInTheDocument();
  });

  it('rejects input longer than 500 characters without calling onAsk', async () => {
    const onAsk = vi.fn();
    render(<QuestionForm onAsk={onAsk} />);
    
    const input = screen.getByPlaceholderText('form.placeholder');
    const button = screen.getByRole('button', { name: 'form.submit' });
    
    await userEvent.type(input, 'a'.repeat(501));
    await userEvent.click(button);
    
    expect(onAsk).not.toHaveBeenCalled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('form.errorLength');
  });

  it('displays error when onAsk returns false', async () => {
    const onAsk = vi.fn().mockReturnValue(false);
    render(<QuestionForm onAsk={onAsk} />);
    
    const input = screen.getByPlaceholderText('form.placeholder');
    const button = screen.getByRole('button', { name: 'form.submit' });
    
    await userEvent.type(input, 'Valid question?');
    await userEvent.click(button);
    
    expect(onAsk).toHaveBeenCalledWith('Valid question?');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('oracle.error');
  });
});
