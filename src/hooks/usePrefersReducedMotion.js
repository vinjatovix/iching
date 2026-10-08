import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(QUERY).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    
    const mediaQueryList = window.matchMedia(QUERY);
    
    const listener = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}