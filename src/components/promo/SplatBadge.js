import splatUrl from '../../assets/promo/splat-badge.svg';

/**
 * SplatBadge — the cream splat brand mark for the /30-off promo page.
 *
 * Renders the real artboard asset (src/assets/promo/splat-badge.svg, imported
 * as a URL by Vite). Purely decorative: empty alt + aria-hidden, since the
 * discount lives in the live-JSX <h1> ("30% off everything.").
 *
 * To use the exact artboard splat, overwrite that .svg in place — nothing here
 * changes.
 */
const SplatBadge = ({ className = '' }) => (
  <img
    src={splatUrl}
    alt=""
    aria-hidden="true"
    className={`splat-badge ${className}`.trim()}
  />
);

export default SplatBadge;
