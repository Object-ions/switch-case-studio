import useReducedMotion from '../../hooks/useReducedMotion';
import projects from '../../data/projects.json';
import '../../styles/components/clientStrip.scss';

/* ------------------------------------------------------------------ *
 * "Trusted by" marquee — TEXT wordmarks (2026-07, DESIGN_AUDIT P1-6,
 * Moses's pick: option B now, real logos later).
 *
 * The old version marqueed the case-study COVER-TILE images as 96px
 * squares — screenshots posing as logos, and the darkest covers read
 * as empty black squares on the #000 page. Client names as styled text
 * are honest proof and can't vanish.
 *
 * DERIVED from projects.json (2026-08-29) — same law as PRICING_LINKS/
 * PROJECT_LINKS: a component-local copy WILL drift, and this one did
 * (Florida Green shipped 2026-08-26 and never made it here). `featured`
 * AND not `studioProject`: a strip labelled "Trusted by" lists clients,
 * not our own products (Scout, Jelly Belly Wiki) or non-client work
 * (Birth of Venus). Adding a featured client updates the marquee
 * automatically. The loop is
 * count-agnostic (translateX(-50%) over a duplicated track), so length
 * changes need no CSS edit.
 *
 * LOGO-READY: a project may carry `clientLogo` (path to a real wordmark
 * asset) + `clientLogoAlt` in projects.json. When present it renders
 * instead of the text — upgrading to option A is a data edit, not a
 * refactor. Before adding a logo, verify its provenance/permission
 * (CLAUDE.md rule).
 * ------------------------------------------------------------------ */
const CLIENTS = projects
  .filter((p) => p.featured && !p.studioProject)
  .map((p) => ({
    name: p.title,
    logo: p.clientLogo || null,
    logoAlt: p.clientLogoAlt,
  }));

/* One rendered cell — text wordmark now, image later when `logo` lands.
 * Each mark is followed by the brand's eight-point star (VE-2026-07
 * elevation): decorative rhythm only, hidden from AT, fixed-size so the
 * loop geometry is unchanged. */
const ClientMark = ({ client }) =>
  client.logo ? (
    <img
      src={client.logo}
      alt={client.logoAlt || client.name}
      className="client-strip__logo-img"
      loading="lazy"
      draggable="false"
    />
  ) : (
    <span className="client-strip__name">{client.name}</span>
  );

const StarSep = () => (
  <span className="client-strip__sep" aria-hidden="true">
    &#10035;
  </span>
);

const ClientStrip = () => {
  const reduced = useReducedMotion();

  return (
    <section className="client-strip" aria-label="Clients we've worked with">
      <p className="client-strip__label">Trusted by</p>

      <div className="client-strip__track-wrap">
        <ul
          className={`client-strip__track ${reduced ? 'client-strip__track--paused' : ''}`}
        >
          {/* First set is REAL content: client names are legitimate proof
              and belong in the accessibility tree (the old all-hidden track
              made sense for decorative image squares, not for names). */}
          {CLIENTS.map((c) => (
            <li key={c.name} className="client-strip__item">
              <ClientMark client={c} />
              <StarSep />
            </li>
          ))}
          {/* Second set exists only for the seamless CSS loop — hidden from
              AT so nobody hears the client list twice. */}
          {CLIENTS.map((c) => (
            <li
              key={`${c.name}-dup`}
              className="client-strip__item"
              aria-hidden="true"
            >
              <ClientMark client={c} />
              <StarSep />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientStrip;
