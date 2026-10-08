import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageSelector } from '../../src/components/LanguageSelector';
import { localizationService } from '../../src/services/localizationService';

vi.mock('../../src/services/localizationService', () => ({
  localizationService: {
    changeLanguageSafely: vi.fn().mockResolvedValue({ success: true, language: 'en' })
  }
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
    i18n: {
      language: 'es',
      resolvedLanguage: 'es',
    }
  })
}));

describe('LanguageSelector component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders accessible label and is focusable via keyboard', () => {
    render(<LanguageSelector />);
    
    const select = screen.getByLabelText('Seleccionar idioma');
    expect(select).toBeInTheDocument();
    
    select.focus();
    expect(select).toHaveFocus();
  });

  it('hides decorative chevron SVG from assistive technology', () => {
    const { container } = render(<LanguageSelector />);
    const chevron = container.querySelector('.language-selector-arrow');
    expect(chevron).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls localizationService.changeLanguageSafely on selection change', async () => {
    render(<LanguageSelector />);
    
    const select = screen.getByLabelText('Seleccionar idioma');
    await userEvent.selectOptions(select, 'en');

    expect(localizationService.changeLanguageSafely).toHaveBeenCalledWith('en');
  });

  it('dispatches app-notification alert when language change fails', async () => {
    localizationService.changeLanguageSafely.mockResolvedValueOnce({
      success: false,
      error: 'NETWORK_ERROR',
      previousLanguage: 'es'
    });
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<LanguageSelector />);
    
    const select = screen.getByLabelText('Seleccionar idioma');
    await userEvent.selectOptions(select, 'fr');

    expect(dispatchSpy).toHaveBeenCalled();
    const event = dispatchSpy.mock.calls[0][0];
    expect(event.type).toBe('app-notification');
    expect(event.detail.politeness).toBe('assertive');
  });
});
