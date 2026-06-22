/**
 * SplatBadge — decorative "seal" splat for the /30-off promo page.
 *
 * PLACEHOLDER: a parametric wavy-seal blob generated from sin/cos so it scales
 * cleanly via viewBox with no flat-export cruft. Swap with the real artboard
 * splat (design-src/promo/ad-30.svg) when it's extracted to src/assets/promo/ —
 * keep the same viewBox (0 0 100 100) and the component API and nothing else
 * needs to change.
 *
 * Purely visual: aria-hidden. The promo's discount text lives in the live-JSX
 * <h1> ("30% off everything."), not in this SVG, so screen readers get it once.
 */

// One closed path of `spikes` rounded bumps, alternating outer/inner radius
// around the centre — the classic sticker/seal silhouette.
const buildSplat = (spikes = 14, outer = 48, inner = 40, cx = 50, cy = 50) => {
  const step = Math.PI / spikes; // half a bump per step (out, in, out, …)
  const pts = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  // Smooth the corners with quadratic curves through the midpoints.
  let d = '';
  for (let i = 0; i < pts.length; i += 1) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[(i + 1) % pts.length];
    const mx = (x + nx) / 2;
    const my = (y + ny) / 2;
    d += i === 0 ? `M ${mx.toFixed(2)} ${my.toFixed(2)}` : '';
    d += ` Q ${x.toFixed(2)} ${y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  return `${d} Z`;
};

const SPLAT_PATH = buildSplat();

const SplatBadge = ({ className = '', label = '30% OFF' }) => (
  <span className={`splat-badge ${className}`.trim()}>
    <svg
      className="splat-badge__shape"
      viewBox="0 0 100 100"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path d={SPLAT_PATH} />
    </svg>
    {/* live JSX text, not SVG — decorative duplicate of the h1 discount */}
    <span className="splat-badge__label" aria-hidden="true">
      {label}
    </span>
  </span>
);

export default SplatBadge;
