import { rand, normRand } from '../core/prng.js';
import { noise } from '../core/noise.js';

/**
 * Creates an organic, sinuous Shan-Shui cloud ribbon path.
 * Modeled after traditional Chinese ink-wash cloud scrolls (Yunqi 雲氣).
 *
 * @param {number} x0 - Start X position
 * @param {number} y0 - Central Y altitude
 * @param {number} len - Horizontal length of the cloud band
 * @param {number} hei - Vertical thickness of the cloud billow
 * @param {number} seedOffset - Noise seed offset for unique organic variation
 * @returns {string} SVG path d attribute
 */
function createCloudBand(x0, y0, len, hei, seedOffset = 0) {
  const steps = 36;
  const dx = len / steps;

  // Upper billowing contour with Perlin-modulated cloud crests
  const topPoints = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + i * dx;
    const progress = i / steps;
    // Parabolic taper at left and right extremities
    const taper = Math.sin(progress * Math.PI);
    const n = noise.noise(x * 0.007 + seedOffset, y0 * 0.012);
    const wave = Math.sin(progress * Math.PI * 3.5 + seedOffset) * 0.22;
    const dy = (n * 0.8 + wave) * hei * taper;
    topPoints.push({ x: Number(x.toFixed(1)), y: Number((y0 - dy).toFixed(1)) });
  }

  // Lower contour with gentler, softer ink wash falloff
  const bottomPoints = [];
  for (let i = steps; i >= 0; i--) {
    const x = x0 + i * dx;
    const progress = i / steps;
    const taper = Math.sin(progress * Math.PI);
    const n = noise.noise(x * 0.005 + seedOffset + 80, (y0 + 15) * 0.01);
    const wave = Math.cos(progress * Math.PI * 2.8 + seedOffset) * 0.18;
    const dy = (n * 0.65 + wave) * (hei * 0.7) * taper;
    bottomPoints.push({ x: Number(x.toFixed(1)), y: Number((y0 + dy).toFixed(1)) });
  }

  // Smooth quadratic Bézier interpolation for calligraphic softness
  let d = `M ${topPoints[0].x} ${topPoints[0].y}`;
  for (let i = 1; i < topPoints.length; i++) {
    const prev = topPoints[i - 1];
    const curr = topPoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  d += ` L ${topPoints[topPoints.length - 1].x} ${topPoints[topPoints.length - 1].y}`;

  for (let i = 0; i < bottomPoints.length; i++) {
    const prev = i === 0 ? topPoints[topPoints.length - 1] : bottomPoints[i - 1];
    const curr = bottomPoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  d += ` Z`;

  return d;
}

/**
 * Generates procedural Shan-Shui clouds with randomized positioning,
 * widths, and elevations across the sky.
 *
 * Positioned in front of the moon in the SVG stack, so clouds traversing
 * the lunar coordinates (x: ~380, y: ~88) softly veil and dim the nocturnal disc.
 */
export function generateClouds() {
  let canv = `<g class="shanshui-clouds">`;

  // 1. Cloud near the lunar quadrant (randomized: sometimes directly over the moon, sometimes grazing it)
  const moonCloudX = normRand(160, 320);
  const moonCloudY = normRand(72, 110);
  const moonCloudLen = normRand(320, 480);
  const moonCloudHei = normRand(24, 40);
  const moonOffset = rand() * 100;

  // Primary cloud body
  canv += `<path class="shanshui-cloud" d="${createCloudBand(moonCloudX, moonCloudY, moonCloudLen, moonCloudHei, moonOffset)}" />`;
  // Companion trailing wisp for atmospheric ink wash layering (Die Mo 叠墨)
  if (rand() > 0.3) {
    canv += `<path class="shanshui-cloud shanshui-cloud--wisp" d="${createCloudBand(moonCloudX + 60, moonCloudY + 12, moonCloudLen * 0.75, moonCloudHei * 0.6, moonOffset + 35)}" />`;
  }

  // 2. Center sky floating cloud
  const centerCloudX = normRand(500, 750);
  const centerCloudY = normRand(55, 125);
  const centerCloudLen = normRand(280, 480);
  const centerCloudHei = normRand(20, 36);
  const centerOffset = rand() * 100;

  canv += `<path class="shanshui-cloud" d="${createCloudBand(centerCloudX, centerCloudY, centerCloudLen, centerCloudHei, centerOffset)}" />`;
  if (rand() > 0.4) {
    canv += `<path class="shanshui-cloud shanshui-cloud--wisp" d="${createCloudBand(centerCloudX + 40, centerCloudY - 8, centerCloudLen * 0.7, centerCloudHei * 0.55, centerOffset + 20)}" />`;
  }

  // 3. Right sky cloud (hovering above distant mountain peaks)
  const rightCloudX = normRand(920, 1200);
  const rightCloudY = normRand(60, 135);
  const rightCloudLen = normRand(300, 520);
  const rightCloudHei = normRand(22, 38);
  const rightOffset = rand() * 100;

  canv += `<path class="shanshui-cloud" d="${createCloudBand(rightCloudX, rightCloudY, rightCloudLen, rightCloudHei, rightOffset)}" />`;

  // 4. Low-altitude misty pass cloud (drifting across the mid horizon)
  if (rand() > 0.35) {
    const lowCloudX = normRand(350, 850);
    const lowCloudY = normRand(160, 215);
    const lowCloudLen = normRand(400, 650);
    const lowCloudHei = normRand(18, 30);
    canv += `<path class="shanshui-cloud shanshui-cloud--wisp" d="${createCloudBand(lowCloudX, lowCloudY, lowCloudLen, lowCloudHei, rand() * 100)}" />`;
  }

  canv += `</g>`;
  return canv;
}
