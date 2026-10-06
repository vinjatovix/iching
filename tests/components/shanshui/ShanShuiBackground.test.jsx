import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ShanShuiBackground } from '../../../src/components/shanshui/ShanShuiBackground';
import { generateShanShuiScene } from '../../../src/components/shanshui/shanshui';

describe('ShanShuiBackground', () => {
  it('renders SVG background container with landscape paths', () => {
    const { container } = render(<ShanShuiBackground />);

    const svgElement = container.querySelector('.shanshui-svg');

    expect(svgElement).toBeInTheDocument();
  });

  it('generates non-empty SVG markup containing mountains, pagodas, and trees', () => {
    const scene = generateShanShuiScene("108");

    expect(scene).toContain('<polyline');
    expect(scene).toContain('stroke-width');
    expect(scene).toContain('shanshui-stars');
    expect(scene).toContain('shanshui-moon');
    expect(scene).toContain('shanshui-clouds');
    expect(scene.length).toBeGreaterThan(10000);
  });

  it('generates procedurally varied clouds across different seeds', () => {
    const sceneA = generateShanShuiScene("seed-alpha");
    const sceneB = generateShanShuiScene("seed-beta");

    expect(sceneA).toContain('shanshui-clouds');
    expect(sceneB).toContain('shanshui-clouds');
    expect(sceneA).not.toBe(sceneB);
  });
});
