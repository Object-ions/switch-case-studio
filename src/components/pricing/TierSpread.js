import * as brandIdentity from "./spreads/brandIdentity";
import "../../styles/components/servicePoster.scss";
import "../../styles/components/tierSpread.scss";

/* Tier spreads (2026-09-26): the cream "what you walk away with" band at the
   top of a pricing tier card. One tile per deliverable, drawn on the studio's
   own brand; a tier that includes the one below shows that tier's whole
   spread as one contact-sheet tile. Static SVG, SSR-complete, no motion:
   the markup is the finished picture. Services without a spread render
   nothing (hasTierSpread gates the card's band). */
const SPREADS = {
  "design-branding": brandIdentity,
};

export const hasTierSpread = (serviceId, tierName) =>
  Boolean(SPREADS[serviceId] && SPREADS[serviceId].TIERS[tierName]);

// Every tile id a tier carries, own and inherited, in tier order.
const allTiles = (spread, tierName) => {
  const tier = spread.TIERS[tierName];
  if (!tier) return [];
  return [...(tier.inherits ? allTiles(spread, tier.inherits) : []), ...tier.tiles];
};

const Tile = ({ Art }) => (
  <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
    <Art />
  </svg>
);

// The inherited tier as a contact sheet: its tiles as thumbnails on one
// tile, in a grid sized to their count (4 -> 2x2, 8 -> 4x2).
const Sheet = ({ spread, tierName }) => {
  const ids = allTiles(spread, tierName);
  const cols = ids.length > 4 ? 4 : 2;
  const rows = Math.ceil(ids.length / cols);
  const gap = 12;
  const w = (400 - gap * (cols + 1)) / cols;
  const h = (300 - gap * (rows + 1)) / rows;
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      {ids.map((id, i) => {
        const { Art } = spread.TILES[id];
        const x = gap + (i % cols) * (w + gap);
        const y = gap + Math.floor(i / cols) * (h + gap);
        return (
          <g key={id}>
            <rect x={x} y={y} width={w} height={h} className="sp-f-cream" stroke="#141414" strokeWidth="2" />
            <svg x={x} y={y} width={w} height={h} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
              <Art />
            </svg>
          </g>
        );
      })}
    </svg>
  );
};

export default function TierSpread({ serviceId, tierName }) {
  const spread = SPREADS[serviceId];
  const tier = spread && spread.TIERS[tierName];
  if (!tier) return null;
  return (
    <figure className="tsp">
      <span className="tsp__head">What you walk away with</span>
      <div className="tsp__grid">
        {tier.inherits && (
          <div className="tsp__item tsp__item--sheet">
            <span className="tsp__tile">
              <Sheet spread={spread} tierName={tier.inherits} />
            </span>
            <span className="tsp__label">Everything in {tier.inherits}</span>
          </div>
        )}
        {tier.tiles.map((id) => {
          const { label, Art } = spread.TILES[id];
          return (
            <div key={id} className="tsp__item">
              <span className="tsp__tile">
                <Tile Art={Art} />
              </span>
              <span className="tsp__label">{label}</span>
            </div>
          );
        })}
      </div>
      <figcaption className="tsp__note">Shown on our own brand. Yours is built from scratch.</figcaption>
    </figure>
  );
}
