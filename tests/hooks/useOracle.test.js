import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOracle } from '../../src/hooks/useOracle';

// Mock IChing ask function
vi.mock('i-ching', () => ({
  default: {
    ask: vi.fn((q) => {
      if (q === 'Error') throw new Error('Simulated error');
      return { 
        hexagram: { number: 1, character: '䷀' }, 
        change: { to: { number: 2, character: '䷁' } }
      };
    })
  }
}));

describe('useOracle hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('askQuestion constraints', () => {
    it.each([
      { input: '', description: 'empty string' },
      { input: '   ', description: 'whitespace only' },
      { input: 'a'.repeat(501), description: 'exceeds 500 characters' }
    ])('rejects $description without mutating state', ({ input }) => {
      const { result } = renderHook(() => useOracle());
      const initialLength = result.current.consultations.length;
      
      act(() => {
        result.current.askQuestion(input);
      });
      
      expect(result.current.consultations.length).toBe(initialLength);
      expect(result.current.error).toBeTruthy();
    });

    it('accepts valid input and creates consultation in ephemeral memory', () => {
      const { result } = renderHook(() => useOracle());
      
      act(() => {
        result.current.askQuestion('Will it rain?');
      });
      
      expect(result.current.consultations).toHaveLength(1);
      expect(result.current.consultations[0].question).toBe('Will it rain?');
      expect(result.current.consultations[0].rawReading.hexagram.number).toBe(1);
      expect(result.current.error).toBeNull();
    });
  });

  describe('clearHistory functionality', () => {
    it('resets consultations array and dispatches polite announcement', () => {
      const { result } = renderHook(() => useOracle());
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      
      act(() => {
        result.current.askQuestion('First');
        result.current.askQuestion('Second');
      });
      
      act(() => {
        result.current.clearHistory();
      });
      
      expect(result.current.consultations).toHaveLength(0);
      expect(dispatchSpy).toHaveBeenCalled();
      
      const eventArg = dispatchSpy.mock.calls[0][0];
      expect(eventArg.type).toBe('app-notification');
      expect(eventArg.detail.politeness).toBe('polite');
    });
  });
});
