import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIChing } from '../../src/hooks/useIChing';
import { localizationService } from '../../src/services/localizationService';

describe('useIChing', () => {
  beforeEach(async () => {
    await act(async () => {
      await localizationService.changeLanguageSafely('es');
    });
  });

  it('returns null data when question is empty', () => {
    const { result } = renderHook(() => useIChing(''));

    expect(result.current.reading).toBeNull();
    expect(result.current.primaryHexagram).toBeNull();
    expect(result.current.changingHexagram).toBeNull();
  });

  it('returns valid primary hexagram with details from hexagrams.json', () => {
    const question = '¿Cómo irá el proyecto?';

    const { result } = renderHook(() => useIChing(question));

    expect(result.current.reading).not.toBeNull();
    expect(result.current.primaryHexagram).toBeDefined();
    expect(result.current.primaryHexagram.nombre).toBeDefined();
    expect(result.current.primaryHexagram.juicio).toBeDefined();
  });

  it('matches reading hexagram number with primaryHexagram id', () => {
    const question = '¿Qué debo contemplar hoy?';

    const { result } = renderHook(() => useIChing(question));

    expect(result.current.reading.hexagram.number).toBe(result.current.primaryHexagram.id);
  });

  it('preserves the same hexagram id when language changes', async () => {
    const { result, rerender } = renderHook(() => useIChing('¿Cómo irá el proyecto?'));
    const initialHexagramId = result.current.primaryHexagram.id;

    await act(async () => {
      await localizationService.changeLanguageSafely('en');
    });
    rerender();

    expect(result.current.primaryHexagram.id).toBe(initialHexagramId);
  });

  it.each([
    { lang: 'es', expectedFirstHexName: 'EL CREADOR' },
    { lang: 'gl', expectedFirstHexName: 'O CREADOR' },
    { lang: 'eu', expectedFirstHexName: 'SORTZAILEA' },
    { lang: 'ca', expectedFirstHexName: 'EL CREADOR' },
    { lang: 'en', expectedFirstHexName: 'THE CREATOR' },
    { lang: 'fr', expectedFirstHexName: 'LE CRÉATEUR' },
    { lang: 'it', expectedFirstHexName: 'IL CREATORE' },
    { lang: 'ro', expectedFirstHexName: 'CREATORUL' },
    { lang: 'pt', expectedFirstHexName: 'O CRIADOR' },
    { lang: 'de', expectedFirstHexName: 'DAS SCHÖPFERISCHE' },
    { lang: 'el', expectedFirstHexName: 'Ο ΔΗΜΙΟΥΡΓΟΣ' },
    { lang: 'nl', expectedFirstHexName: 'DE SCHEPPER' },
    { lang: 'pl', expectedFirstHexName: 'TWÓRCA' },
    { lang: 'sv', expectedFirstHexName: 'SKAPAREN' },
  ])('provides localized primary hexagram data for language "$lang"', async ({ lang, expectedFirstHexName }) => {
    await act(async () => {
      await localizationService.changeLanguageSafely(lang);
    });

    const fixedReading = {
      hexagram: { number: 1, character: '䷀' },
      change: null
    };

    const { result } = renderHook(() => useIChing('Life purpose and path', fixedReading));

    expect(result.current.primaryHexagram).toBeDefined();
    expect(result.current.primaryHexagram.nombre.toUpperCase()).toContain(expectedFirstHexName);
    expect(result.current.primaryHexagram.juicio).toBeTruthy();
    expect(result.current.primaryHexagram.imagen).toBeTruthy();
  });
});
