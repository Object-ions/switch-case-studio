import useReducedMotion from '../../hooks/useReducedMotion';
import '../../styles/components/clientStrip.scss';

const CLIENTS = [
  { name: 'Zahav Medspa',              tile: '/projects/zahav/zahav-cover-tile.webp' },
  { name: 'Crimson Equities',          tile: '/projects/crimson/crimson-cover-tile.webp' },
  { name: 'Jo Marketing 11',           tile: '/projects/jo-marketing-11/jo-marketing-11-cover-tile.webp' },
  { name: 'Prodani Miami',             tile: '/projects/prodani/prodani-cover-tile.webp' },
  { name: 'Florida Energy Assistance', tile: '/projects/florida-energy-assistance/florida-energy-assistance-cover-tile.webp' },
  { name: 'Sha Design Studio',         tile: '/projects/sha-design-studio/sha-design-studio-cover-tile.webp' },
  { name: 'Jelly Belly Wiki',          tile: '/projects/jelly-belly-wiki/jelly-belly-wiki-cover-tile.webp' },
];

// Logos render at 96px (≤96 desktop) / 76px (mobile) in a square object-fit
// box, so the full 1034w source was ~5x oversampled. Serve small derivatives
// only — the 1034w original stays the no-srcset fallback but is never picked.
const srcsetFor = (p) => {
  const b = p.replace(/\.webp$/, '');
  return `${b}-256.webp 256w, ${b}-512.webp 512w`;
};

const ClientStrip = () => {
  const reduced = useReducedMotion();

  return (
    <section className="client-strip" aria-label="Selected clients">
      <p className="client-strip__label">Trusted by</p>

      <div className="client-strip__track-wrap" aria-hidden="true">
        <ul
          className={`client-strip__track ${reduced ? 'client-strip__track--paused' : ''}`}
          role="presentation"
        >
          {/* Duplicated for seamless loop */}
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <li key={i} className="client-strip__item">
              <img
                src={c.tile}
                srcSet={srcsetFor(c.tile)}
                sizes="(max-width: 668px) 76px, 96px"
                width="1034"
                height="1446"
                alt={c.name}
                className="client-strip__logo"
                loading="lazy"
                draggable="false"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientStrip;
