import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function QuestionForm({ onAsk, placeholder }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed.length > 0) {
      onAsk(trimmed);
      setInputValue('');
    }
  };

  const inputPlaceholder = placeholder || t('form.placeholder');

  return (
    <form className="iching-form" onSubmit={handleSubmit}>
      <div className="iching-form__group">
        <label htmlFor="iching-question-input" className="sr-only">
          {t('form.questionLabel')}
        </label>
        <input
          id="iching-question-input"
          type="text"
          className="iching-form__input"
          value={inputValue}
          placeholder={inputPlaceholder}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label={t('form.questionLabel')}
          autoFocus
        />
        <button type="submit" className="iching-form__button">
          {t('form.submit')}
        </button>
      </div>
    </form>
  );
}
