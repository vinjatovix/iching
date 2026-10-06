import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '../../src/components/LanguageSelector';
import i18n, { SUPPORTED_LANGUAGES } from '../../src/i18n';

describe('LanguageSelector', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  it('renders select input with all supported language options', () => {
    render(<LanguageSelector />);

    const select = screen.getByRole('combobox', { name: /seleccionar idioma/i });

    expect(select.children.length).toBe(SUPPORTED_LANGUAGES.length);
  });

  it.each(SUPPORTED_LANGUAGES)(
    'contains language option for $name with value $code',
    ({ code, name }) => {
      render(<LanguageSelector />);

      const option = screen.getByRole('option', { name });

      expect(option).toHaveValue(code);
    }
  );

  it('changes active language when a new option is selected', () => {
    render(<LanguageSelector />);
    const select = screen.getByRole('combobox', { name: /seleccionar idioma/i });

    fireEvent.change(select, { target: { value: 'en' } });

    expect(i18n.language).toBe('en');
  });
});
