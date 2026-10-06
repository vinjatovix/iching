import { rand } from '../core/prng.js';

export function generateStars(count = 60, width = 1600, maxSkyY = 150) {
  let canv = `<g class="shanshui-stars">`;

  for (let i = 0; i < count; i++) {
    // Distribute horizontally across the canvas
    const x = Math.floor(rand() * (width - 40) + 20);
    // Keep strictly above the distant mountain horizon (y: 12 to 145)
    const y = Math.floor(Math.pow(rand(), 1.2) * (maxSkyY - 15) + 15);
    const r = (rand() * 0.8 + 0.6).toFixed(1);
    const alpha = (rand() * 0.45 + 0.4).toFixed(2);

    canv += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(230, 240, 255, ${alpha})" class="shanshui-star" />`;
  }

  canv += `</g>`;
  return canv;
}
