import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function QuestionForm({ onAsk, placeholder }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) {
      setError(t('form.errorRequired', 'Question cannot be empty'));
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 500) {
      setError(t('form.errorLength', 'Question is too long'));
      inputRef.current?.focus();
      return;
    }
    setError('');
    
    const success = onAsk(trimmed);
    
    if (success !== false) {
      setInputValue('');
    } else {
      setError(t('oracle.error', 'Could not consult the oracle at this time. Please try again.'));
    }
    inputRef.current?.focus();
  };

  const inputPlaceholder = placeholder || t('form.placeholder');

  return (
    <form className="iching-form" onSubmit={handleSubmit} noValidate>
      <div className="iching-form__group">
        <label htmlFor="iching-question-input" className="sr-only">
          {t('form.questionLabel')}
        </label>
        <input
          id="iching-question-input"
          ref={inputRef}
          type="text"
          className="iching-form__input"
          value={inputValue}
          placeholder={inputPlaceholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
          aria-label={t('form.questionLabel')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'question-error' : undefined}
        />
        <button type="submit" className="iching-form__button">
          {t('form.submit')}
        </button>
      </div>
      {error && (
        <div id="question-error" className="iching-form__error" role="alert" style={{ color: 'var(--accent-red)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
    </form>
  );
}
