import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Seo from '../util/Seo';
import projectsData from '../../data/projects.json';
import { groupProjects } from '../../data/projectGroups';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import BookCallCta from '../ui/BookCallCta';
import { DUR_MED, EASE_OUT } from '../../animation/motionTokens';
import '../../styles/components/projectsPage.scss';

/* /projects (redesign 2026-09-27, owner: "re-design and update"): the home
 * case-study index grown into a page. Left, every project in the same typed
 * groups as the home (src/data/projectGroups.js), numbered, each with ONE
 * measured figure (`indexMetric`: its value is one of the case study's own
 * `metrics[]` values, verbatim; the label is shortened) and its index line.
 * Right, a sticky stage showing the real site of the hovered or focused
 * project, a link to that case study; on phones the stage folds into a
 * thumbnail on each row. No badges, tags or card chrome: the list is the
 * page. Static HTML is complete; the crossfade is CSS. */
const grouped = groupProjects(projectsData);
// The stage opens on the first row as RENDERED (the top of the first group),
// so the highlighted entry is on screen with its preview; the home index
// opens on the newest project instead, because its columns sit side by side.
const first = grouped[0]?.projects[0] || projectsData[0];

const meta = (p) =>
  [p.indexLine, p.year, p.studioProject && 'Studio project'].filter(Boolean).join(' · ');

// The 600w sibling serves the phone thumbnail; the stage takes the 1200w.
const small = (src) => src.replace(/\.webp$/, '-600.webp');

const CaseStudiesPage = () => {
  const [active, setActive] = useState(first?.slug);
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  /* One call per page (module-level latches). The selector covers the
   * head, the groups and the stage, so a client navigation reveals the
   * whole page in one stagger; a direct load keeps the static HTML as is. */
  usePageHeaderReveal(rootRef, '.page-head-animate, .pi__group, .pi__stage');
  const current = projectsData.find((p) => p.slug === active) || first;

  /* Preview swap: the incoming image settles from 98% while the CSS
     crossfade runs (same as the home index). Scale is GSAP's, opacity is
     the stylesheet's. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    const img = root.querySelector('.pi__preview.is-active');
    if (!img) return undefined;
    const tween = gsap.fromTo(
      img,
      { scale: 0.98 },
      { scale: 1, duration: DUR_MED, ease: EASE_OUT, overwrite: 'auto' },
    );
    return () => tween.kill();
  }, [active, reduced]);

  let n = 0;

  return (
    <>
      <Seo
        title="Case Studies | Switch Case Studio"
        description="Browse Switch Case Studio's portfolio: landing pages, websites, e-commerce stores, and apps built for clients across the US."
        path="/projects"
      />

      <article className="projects-page" aria-label="Case studies" ref={rootRef}>
        <header className="projects-page__header">
          <p className="projects-page__kicker page-head-animate">Portfolio</p>
          <h1 className="projects-page__title page-head-animate">Selected work</h1>
          <p className="projects-page__lede page-head-animate">
            {projectsData.length} projects, every one built from scratch, most with a
            number you can check.
          </p>
        </header>

        <div className="pi">
          <div className="pi__list">
            {grouped.map((g) => (
              <section className="pi__group" key={g.heading} aria-label={g.heading}>
                <h2 className="pi__heading">{g.heading}</h2>
                {g.projects.map((p) => {
                  n += 1;
                  const src = p.preview || p.imageSrc;
                  return (
                    <Link
                      key={p.slug}
                      to={`/projects/${p.slug}`}
                      className={`pi__entry${p.slug === active ? ' is-active' : ''}`}
                      onMouseEnter={() => setActive(p.slug)}
                      onFocus={() => setActive(p.slug)}
                    >
                      <span className="pi__num" aria-hidden="true">
                        {String(n).padStart(2, '0')}
                      </span>
                      {/* Phone only (CSS): the preview sits on the row. A
                          display:none image never loads, so desktop pays
                          nothing for it. */}
                      <img
                        className="pi__thumb"
                        src={small(src)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="375"
                      />
                      <span className="pi__entry-text">
                        <span className="pi__entry-title">{p.title}</span>
                        <span className="pi__entry-meta">{meta(p)}</span>
                      </span>
                      {p.indexMetric && (
                        <span className="pi__entry-metric">
                          <b className="pi__entry-value">{p.indexMetric.value}</b>
                          <span className="pi__entry-label">{p.indexMetric.label}</span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </section>
            ))}
          </div>

          {/* Every preview stays in the DOM, stacked, so a hover crossfades
              instead of waiting on a fetch (same as the home index). The
              stage is itself a link to the shown case study; the images are
              decorative, the caption is the link's text. */}
          <Link
            to={`/projects/${current.slug}`}
            className="pi__stage"
            tabIndex={-1}
          >
            <span className="pi__slot">
              {projectsData.map((p) => (
                <img
                  key={p.slug}
                  className={`pi__preview${p.slug === active ? ' is-active' : ''}`}
                  src={p.preview || p.imageSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="750"
                />
              ))}
            </span>
            <span className="pi__caption">
              <span className="pi__caption-title">{current.title}</span>
              <span className="pi__caption-meta">{current.indexLine || current.type}</span>
              <span className="pi__caption-cta">Open case study →</span>
            </span>
          </Link>
        </div>

        <div className="projects-page__bottom">
          <p className="projects-page__bottom-text">Want to see what we can build for you?</p>
          <BookCallCta className="projects-page__bottom-btn" />
        </div>
      </article>
    </>
  );
};

export default CaseStudiesPage;
