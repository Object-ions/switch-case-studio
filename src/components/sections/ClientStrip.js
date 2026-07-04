import useReducedMotion from '../../hooks/useReducedMotion';
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
 * LOGO-READY: each entry may carry `logo` (path to a real wordmark
 * asset) + `logoAlt`. When `logo` is present it renders instead of the
 * text — upgrading to option A is a data edit, not a refactor. Before
 * adding a logo, verify its provenance/permission (CLAUDE.md rule).
 * ------------------------------------------------------------------ */
const CLIENTS = [
  { name: 'Zahav Medspa', logo: null },
  { name: 'Crimson Equities', logo: null },
  { name: 'Jo Marketing 11', logo: null },
  { name: 'Prodani Miami', logo: null },
  { name: 'Florida Energy Assistance', logo: null },
  { name: 'Sha Design Studio', logo: null },
  { name: 'Jelly Belly Wiki', logo: null },
];

/* One rendered cell — text wordmark now, image later when `logo` lands. */
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientStrip;
