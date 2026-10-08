import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePrefersReducedMotion } from '../../src/hooks/usePrefersReducedMotion';

describe('usePrefersReducedMotion hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when media query matches', () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    
    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('updates state dynamically when listener fires', () => {
    let mockListener = null;
    window.matchMedia.mockImplementation(() => ({
      matches: false,
      addEventListener: (evt, listener) => {
        if (evt === 'change') mockListener = listener;
      },
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    
    expect(result.current).toBe(false);

    act(() => {
      if (mockListener) mockListener({ matches: true });
    });
    
    expect(result.current).toBe(true);
  });
});
