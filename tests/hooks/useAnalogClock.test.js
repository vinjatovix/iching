import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAnalogClock } from '../../src/hooks/useAnalogClock';
import * as analogClockProps from '../../src/tools/analogClockProps';

describe('useAnalogClock hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('provides localized formatted time string and initial degrees', () => {
    const mockDate = new Date('2026-10-06T12:30:45');
    vi.setSystemTime(mockDate);
    
    vi.spyOn(analogClockProps, 'getAnalogClockProps').mockReturnValue({
      hourDegrees: '90deg',
      minuteDegrees: '180deg',
      secondDegrees: '270deg'
    });

    const { result } = renderHook(() => useAnalogClock());
    
    expect(result.current.timeString).toBe(mockDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    expect(result.current.hourDegrees).toBe('90deg');
  });

  it('maintains monotonic clockwise progression across 360-degree boundary', () => {
    // 12:00:59 -> next is 12:01:00
    const mockDate1 = new Date('2026-10-06T12:00:59');
    vi.setSystemTime(mockDate1);
    
    const { result } = renderHook(() => useAnalogClock());
    
    const initialSecond = parseInt(result.current.secondDegrees);
    
    act(() => {
      // advance 1 second to 12:01:00
      vi.advanceTimersByTime(1000);
    });
    
    const nextSecond = parseInt(result.current.secondDegrees);
    
    // Instead of rewinding, it should advance forward by 6 degrees
    expect(nextSecond).toBe(initialSecond + 6);
  });
});
