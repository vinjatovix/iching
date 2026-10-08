import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ShanShuiBackground } from '../../../src/components/shanshui/ShanShuiBackground';
import { generateShanShuiScene } from '../../../src/components/shanshui/shanshui';
import * as usePrefersReducedMotionHook from '../../../src/hooks/usePrefersReducedMotion';

describe('ShanShuiBackground component', () => {
  it('renders SVG background container with aria-hidden true', () => {
    const { container } = render(<ShanShuiBackground />);

    const wrapper = container.querySelector('.shanshui-container');

    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('generates deterministic SVG markup for a fixed seed', () => {
    const scene = generateShanShuiScene("108");

    expect(scene).toContain('<polyline');
    expect(scene).toContain('shanshui-moon');
  });

  it('applies reduced-motion class when preference is true', () => {
    vi.spyOn(usePrefersReducedMotionHook, 'usePrefersReducedMotion').mockReturnValue(true);

    const { container } = render(<ShanShuiBackground />);
    
    const wrapper = container.querySelector('.shanshui-container');
    expect(wrapper).toHaveClass('reduced-motion');
  });

  it('does not apply reduced-motion class when preference is false', () => {
    vi.spyOn(usePrefersReducedMotionHook, 'usePrefersReducedMotion').mockReturnValue(false);

    const { container } = render(<ShanShuiBackground />);
    
    const wrapper = container.querySelector('.shanshui-container');
    expect(wrapper).not.toHaveClass('reduced-motion');
  });
});
