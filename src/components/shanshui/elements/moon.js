/**
 * Shan-Shui Moon Element
 * Generates an ethereal nocturnal moon bathed in soft atmospheric ink-wash haze,
 * inspired by classical Chinese Guohua landscape paintings.
 */
export function generateMoon(cx = 380, cy = 90, r = 32) {
  return `
    <g class="shanshui-moon">
      <defs>
        <radialGradient id="shanshui-moon-haze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255, 252, 235, 0.45)" />
          <stop offset="35%" stop-color="rgba(255, 248, 220, 0.22)" />
          <stop offset="70%" stop-color="rgba(240, 235, 210, 0.08)" />
          <stop offset="100%" stop-color="rgba(200, 210, 225, 0)" />
        </radialGradient>
        <radialGradient id="shanshui-moon-disc" cx="42%" cy="42%" r="58%">
          <stop offset="0%" stop-color="rgba(255, 254, 245, 0.95)" />
          <stop offset="65%" stop-color="rgba(245, 240, 225, 0.88)" />
          <stop offset="90%" stop-color="rgba(230, 222, 205, 0.78)" />
          <stop offset="100%" stop-color="rgba(215, 205, 190, 0.65)" />
        </radialGradient>
        <filter id="shanshui-moon-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>
      <!-- Ethereal outer atmospheric haze (ink wash aura) -->
      <circle cx="${cx}" cy="${cy}" r="${r * 2.6}" fill="url(#shanshui-moon-haze)" />
      <!-- Soft ink mist ring around the moon -->
      <circle cx="${cx}" cy="${cy}" r="${r * 1.5}" fill="url(#shanshui-moon-haze)" opacity="0.7" />
      <!-- Luminous celestial disc with soft rim characteristic of Guohua paintings -->
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#shanshui-moon-disc)" filter="url(#shanshui-moon-blur)" />
      <!-- Delicate inner shading evoking traditional lunar shadows -->
      <path d="M ${cx - r * 0.55} ${cy - r * 0.4} A ${r * 0.9} ${r * 0.9} 0 0 0 ${cx + r * 0.3} ${cy + r * 0.65} A ${r} ${r} 0 0 1 ${cx - r * 0.55} ${cy - r * 0.4} Z" fill="rgba(195, 185, 170, 0.18)" filter="url(#shanshui-moon-blur)" />
    </g>
  `;
}
