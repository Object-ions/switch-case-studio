/**
 * bentoEffects.js
 * Shared constants and DOM helpers for the Magic Bento visual effects.
 * Used by useBentoParticles and useBentoSpotlight hooks.
 */

// ── Palette ──
export const GLOW_COLOR = '217, 156, 255'; // $g6: #d99cff

// ── Tuning ──
export const PARTICLE_COUNT = 12;
export const SPOTLIGHT_RADIUS = 400;
export const MOBILE_BREAKPOINT = 768;

// ── DOM Helpers ──

/**
 * Creates a tiny glowing dot element at (x, y).
 */
export const createParticle = (x, y, color = GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'bento-particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

/**
 * Returns proximity / fade thresholds for a given spotlight radius.
 */
export const spotlightThresholds = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

/**
 * Sets the CSS custom properties that drive the cursor-tracking
 * border glow on a tile element.
 */
export const setGlowVars = (el, mouseX, mouseY, intensity, radius) => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--glow-x', `${((mouseX - r.left) / r.width) * 100}%`);
  el.style.setProperty('--glow-y', `${((mouseY - r.top) / r.height) * 100}%`);
  el.style.setProperty('--glow-intensity', intensity.toString());
  el.style.setProperty('--glow-radius', `${radius}px`);
};
