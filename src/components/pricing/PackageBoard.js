import * as brandIdentity from "./spreads/brandIdentity";
import "../../styles/components/servicePoster.scss";
import "../../styles/components/packageBoard.scss";

/* Package board (2026-09-26, owner: "too much going on, we need a different
   way to compare the packages"). One cream brand-book sheet per service:
   rows are the deliverables (a thumbnail of the tile art plus its name),
   columns are the packages with their price, a terra dot marks what each
   includes. Rows are grouped by the package that introduces them, in
   package order, so the dots form a staircase and the comparison reads
   without a sentence. Where the data grades a deliverable (basic vs
   expanded palette, 5 to 7 posts), the cell carries that note. The tier's
   own `includes` list stays as the source of truth in a native <details>
   "Full list" per column, closed by default, no JS. A real <table>, so a
   screen reader gets row and column headers. Static, no motion. */
const BOARDS = {
  "design-branding": brandIdentity,
};

export const hasPackageBoard = (serviceId) => Boolean(BOARDS[serviceId]);

// Every tile a package carries: its own plus the chain it inherits.
const tilesOf = (board, name) => {
  const t = board.TIERS[name];
  if (!t) return [];
  return [...(t.inherits ? tilesOf(board, t.inherits) : []), ...t.tiles];
};

const Thumb = ({ Art }) => (
  <span className="pb__thumb">
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <Art />
    </svg>
  </span>
);

export default function PackageBoard({ serviceId, tiers, formatPrice }) {
  const board = BOARDS[serviceId];
  if (!board) return null;
  const spec = tiers.map((t) => ({ ...t, ...(board.TIERS[t.name] || {}) }));
  const best = (t) => (t.badge ? " is-best" : "");

  return (
    <div className="pb pg-animate">
      {/* The page's h2 (the tier cards' h2 titles left with them); the table
          is named by it, so it needs no caption. */}
      <h2 id="pb-title" className="pb__caption">
        What&apos;s in each package
      </h2>
      <table className="pb__table" aria-labelledby="pb-title">
        <thead>
          <tr>
            <td className="pb__corner" />
            {spec.map((t) => (
              <th key={t.name} scope="col" className={`pb__head${best(t)}`}>
                {t.badge && <span className="pb__badge">{t.badge}</span>}
                <span className="pb__name">{t.name}</span>
                <span className="pb__price">
                  {formatPrice(t.price)}
                  <span className="pb__price-note">{t.billing === "monthly" ? "per month" : "one-time"}</span>
                </span>
                {t.for && <span className="pb__for">{t.for}</span>}
              </th>
            ))}
          </tr>
        </thead>
        {spec.map((g, gi) => (
          <tbody key={g.name} className="pb__group">
            <tr className="pb__group-row">
              <th scope="rowgroup" colSpan={spec.length + 1}>
                {gi === 0 ? "In every package" : `From ${g.name}`}
              </th>
            </tr>
            {(g.tiles || []).map((id) => {
              const { label, Art } = board.TILES[id];
              return (
                <tr key={id} className="pb__row">
                  <th scope="row" className="pb__item">
                    <span className="pb__item-inner">
                      <Thumb Art={Art} />
                      <span className="pb__label">{label}</span>
                    </span>
                  </th>
                  {spec.map((t) => {
                    const included = tilesOf(board, t.name).includes(id);
                    const note = included && t.notes && t.notes[id];
                    return (
                      <td key={t.name} className={`pb__cell${best(t)}`}>
                        {included && (
                          <span className="pb__dot">
                            <span className="pb__sr">Included</span>
                          </span>
                        )}
                        {note && <span className="pb__note">{note}</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        ))}
        <tfoot>
          <tr className="pb__row pb__row--text">
            <th scope="row" className="pb__item pb__item--text">
              How we get there
            </th>
            {spec.map((t) => (
              <td key={t.name} className={`pb__cell pb__cell--text${best(t)}`}>
                {(t.process || []).map((line) => (
                  <span key={line} className="pb__line">
                    {line}
                  </span>
                ))}
              </td>
            ))}
          </tr>
          <tr className="pb__row pb__row--text">
            <th scope="row" className="pb__item pb__item--text">
              In full
            </th>
            {spec.map((t) => (
              <td key={t.name} className={`pb__cell pb__cell--text${best(t)}`}>
                <details className="pb__full">
                  <summary>Full list</summary>
                  <ul>
                    {t.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </details>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
      <p className="pb__foot">Shown on our own brand. Yours is built from scratch.</p>
    </div>
  );
}
