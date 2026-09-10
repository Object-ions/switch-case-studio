import { useState } from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../../data/projects.json';

import '../../styles/components/caseStudyIndex.scss';

/* Case-study index (2026-09-09, owner's reference: a CV-style typed index).
   Featured projects are grouped by `type` into three headed columns; every
   entry is a link, and hovering (or focusing) one swaps the preview slot to
   that project's website screenshot (`imageSrc`, the same 1150×1000 house
   frame the /projects cards peek). The slot lives in the intro column under
   the "View all" pill, at column width, and starts on the newest project,
   which is whatever sits FIRST in projects.json. */
const GROUPS = [
  { heading: 'Rebuilds + SEO', types: ['Rebuild + Local SEO', 'Rebuild + SEO'] },
  {
    heading: 'Business websites',
    types: ['Business Website', 'Portfolio Site', 'Landing Page'],
  },
  {
    heading: 'Products + experiments',
    types: ['SaaS Product', 'E-Commerce', 'Full-Stack + API', 'Interactive Experience'],
  },
];

// Every project, not only `featured`: the index is a complete list (the
// owner asked why Birth of Venus, featured: false, was missing). The
// `featured` flag still governs the "Trusted by" strip and the tiles.
const featured = projectsData;

// A project whose `type` matches no group still renders, in a trailing
// "More work" column, so a new type can never drop a case study silently.
const grouped = GROUPS.map((g) => ({
  ...g,
  projects: featured.filter((p) => g.types.includes(p.type)),
}));
const known = new Set(GROUPS.flatMap((g) => g.types));
const leftovers = featured.filter((p) => !known.has(p.type));
if (leftovers.length) {
  grouped.push({ heading: 'More work', types: [], projects: leftovers });
}

const years = featured.map((p) => p.year).filter(Boolean);
const yearRange =
  years.length > 0
    ? `${Math.min(...years)}–${Math.max(...years)}`
    : '';

const CaseStudyIndex = () => {
  const [active, setActive] = useState(featured[0]?.slug);

  return (
    <div className="csi">
      <div className="csi__intro">
        <p className="csi__intro-title">Selected work</p>
        <p className="csi__intro-meta">
          {featured.length} projects
          {yearRange ? ` · ${yearRange}` : ''}
        </p>
        <Link to="/projects" className="csi__viewall">
          All case studies
          <span className="cta-arrow" aria-hidden="true">&rarr;</span>
        </Link>

        {/* Every preview is in the DOM, stacked, so a hover crossfades instead
            of waiting on a fetch; they lazy-load together when the slot scrolls
            into view (~60KB each). Opacity is CSS-owned: no GSAP touches it. */}
        <div className="csi__slot" aria-hidden="true">
          {featured.map((p) => (
            <img
              key={p.slug}
              className={`csi__preview${p.slug === active ? ' is-active' : ''}`}
              src={p.imageSrc}
              alt=""
              loading="lazy"
              decoding="async"
              width="1150"
              height="1000"
            />
          ))}
        </div>
      </div>

      {grouped.map((g) => (
        <div className="csi__group" key={g.heading}>
          <p className="csi__heading">{g.heading}</p>
          {g.projects.map((p) => (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className={`csi__entry${p.slug === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(p.slug)}
              onFocus={() => setActive(p.slug)}
            >
              <span className="csi__entry-title">{p.title}</span>
              <span className="csi__entry-meta">
                {p.type}
                {p.year ? ` · ${p.year}` : ''}
              </span>
            </Link>
          ))}
        </div>
      ))}

    </div>
  );
};

export default CaseStudyIndex;
