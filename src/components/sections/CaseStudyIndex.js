import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '../../data/projects.json';
import useReducedMotion from '../../hooks/useReducedMotion';
import armSafetyNet from '../../animation/armSafetyNet';
import {
  DUR_MED,
  DUR_SLOW,
  EASE_OUT,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_SAFETY_DELAY,
} from '../../animation/motionTokens';

gsap.registerPlugin(ScrollTrigger);

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
    types: ['Business Website', 'Portfolio Site'],
  },
  {
    heading: 'Products + experiments',
    // Landing Page moved here (owner, 2026-09-11) so the Rebuilds column
    // stays short and the preview can sit under it, across columns 1-2.
    types: ['SaaS Product', 'E-Commerce', 'Full-Stack + API', 'Interactive Experience', 'Landing Page'],
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


const CaseStudyIndex = () => {
  const [active, setActive] = useState(featured[0]?.slug);
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  /* Reveal: the intro, then each column's entries in a stagger, the slot
     last. Hidden at runtime only (static HTML stays visible). One trigger on
     the whole index rather than per entry: the columns start on one line, so
     per-entry triggers would all fire in the same frame anyway. Idempotent,
     with the in-view fallback AND the timed net (the repo records both
     behaviours for an already-passed `once` trigger). */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const intro = root.querySelector('.csi__intro');
    const entries = gsap.utils.toArray('.csi__entry, .csi__heading', root);
    const slot = root.querySelector('.csi__slot');
    const all = [intro, ...entries, slot];
    if (reducedMotion) {
      gsap.set(all, { clearProps: 'all' });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(all, { autoAlpha: 0, y: REVEAL_Y });
      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        root.dataset.revealed = String((Number(root.dataset.revealed) || 0) + 1);
        gsap.to(intro, { autoAlpha: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT_SOFT });
        gsap.to(entries, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_SLOW,
          ease: EASE_OUT_SOFT,
          stagger: { each: 0.05, grid: 'auto', from: 'start' },
          delay: 0.1,
        });
        gsap.to(slot, { autoAlpha: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT_SOFT, delay: 0.45 });
      };
      const st = ScrollTrigger.create({ trigger: root, start: 'top 85%', once: true, onEnter: reveal });
      if (st.progress > 0) reveal();
      const disarm = armSafetyNet(
        root,
        () => revealed || all.some((el) => gsap.isTweening(el)),
        () => {
          revealed = true;
          gsap.set(all, { autoAlpha: 1, y: 0 });
        },
        { delay: REVEAL_SAFETY_DELAY },
      );
      return () => disarm();
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  /* Preview swap: the incoming image settles from 98% while the CSS
     crossfade runs. Scale is GSAP's, opacity is the stylesheet's. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;
    const img = root.querySelector('.csi__preview.is-active');
    if (!img) return undefined;
    const tween = gsap.fromTo(img, { scale: 0.98 }, { scale: 1, duration: DUR_MED, ease: EASE_OUT, overwrite: 'auto' });
    return () => tween.kill();
  }, [active, reducedMotion]);

  return (
    <div className="csi" ref={rootRef}>
      <div className="csi__intro">
        <p className="csi__intro-title">Selected work</p>
        <p className="csi__intro-meta">{featured.length} projects</p>
        <Link to="/projects" className="csi__viewall">
          All case studies
        </Link>
      </div>

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

      {grouped.map((g, i) => (
        <div className={`csi__group${i === 0 ? ' csi__group--lead' : ''}`} key={g.heading}>
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
              {p.indexLine && <span className="csi__entry-line">{p.indexLine}</span>}
              <span className="csi__entry-meta">{p.type}</span>
            </Link>
          ))}
        </div>
      ))}

    </div>
  );
};

export default CaseStudyIndex;
