import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IChingOracle } from '../../../src/components/iching/IChingOracle';
import i18n from '../../../src/i18n';

describe('IChingOracle', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  it('renders title and question input form', () => {
    render(<IChingOracle />);

    const titleElement = screen.getByRole('heading', { name: /oráculo del i ching/i });
    const inputElement = screen.getByRole('textbox', { name: /pregunta para el oráculo/i });

    expect(titleElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it('adds reading result when user submits a valid question', async () => {
    render(<IChingOracle />);
    const inputElement = screen.getByRole('textbox', { name: /pregunta para el oráculo/i });
    const submitButton = screen.getByRole('button', { name: /consultar/i });

    fireEvent.change(inputElement, { target: { value: '¿Es buen momento para avanzar?' } });
    fireEvent.click(submitButton);

    const questionHeading = await screen.findByRole('heading', { name: /"¿Es buen momento para avanzar\?"/i });
    expect(questionHeading).toBeInTheDocument();
  });

  it('clears reading history when clear button is clicked', async () => {
    render(<IChingOracle />);
    const inputElement = screen.getByRole('textbox', { name: /pregunta para el oráculo/i });
    const submitButton = screen.getByRole('button', { name: /consultar/i });

    fireEvent.change(inputElement, { target: { value: 'Pregunta para borrar' } });
    fireEvent.click(submitButton);
    await screen.findByRole('heading', { name: /"Pregunta para borrar"/i });
    const clearButton = screen.getByRole('button', { name: /limpiar lecturas/i });
    fireEvent.click(clearButton);

    const questionHeading = screen.queryByRole('heading', { name: /"Pregunta para borrar"/i });
    expect(questionHeading).toBeNull();
  });

  it('provides a polite live region for consultation history updates', () => {
    render(<IChingOracle />);

    const historyRegion = screen.getByRole('region', { name: /historial de consultas/i });

    expect(historyRegion).toHaveAttribute('aria-live', 'polite');
    expect(historyRegion).toHaveAttribute('aria-relevant', 'additions');
  });

  it('hides hexagram unicode symbol from assistive technology', async () => {
    const { container } = render(<IChingOracle />);
    const inputElement = screen.getByRole('textbox', { name: /pregunta para el oráculo/i });
    const submitButton = screen.getByRole('button', { name: /consultar/i });

    fireEvent.change(inputElement, { target: { value: '¿Qué depara el destino?' } });
    fireEvent.click(submitButton);

    await screen.findByRole('heading', { name: /"¿Qué depara el destino\?"/i });
    const symbolElement = container.querySelector('.hexagram-card__symbol');
    expect(symbolElement).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    { lang: 'en', expectedTitle: 'I Ching Oracle' },
    { lang: 'gl', expectedTitle: 'Oráculo do I Ching' },
    { lang: 'eu', expectedTitle: 'I Ching orakulua' },
    { lang: 'ca', expectedTitle: "Oracle de l'I Ching" },
    { lang: 'fr', expectedTitle: 'Oracle du Yi Jing' },
    { lang: 'it', expectedTitle: "Oracolo dell'I Ching" },
    { lang: 'ro', expectedTitle: 'Oracolul I Ching' },
    { lang: 'pt', expectedTitle: 'Oráculo do I Ching' },
    { lang: 'de', expectedTitle: 'I-Ging-Orakel' },
    { lang: 'el', expectedTitle: 'Χρησμός του Ι Τσινγκ' },
    { lang: 'nl', expectedTitle: 'I Tjing Orakel' },
    { lang: 'pl', expectedTitle: 'Wyrocznia I Ching' },
    { lang: 'sv', expectedTitle: 'I Ching Orakel' },
  ])('renders localized title for $lang', ({ lang, expectedTitle }) => {
    i18n.changeLanguage(lang);

    render(<IChingOracle />);

    const titleElement = screen.getByRole('heading', { name: expectedTitle });
    expect(titleElement).toBeInTheDocument();
  });
});
