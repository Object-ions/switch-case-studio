import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import projectsData from '../../data/projects.json';
import { groupProjects } from '../../data/projectGroups';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/projectsPage.scss';

/* /projects (2026-09-27, fourth pass, owner: "it looks weird"): every
 * project is ONE poster tile, the plate itself. Corner meta (type, year),
 * the title and index line in a fixed top band so rows align, the project's
 * one measured figure (`indexMetric`, value verbatim from its `metrics[]`)
 * bottom-left, the real site bleeding off the bottom-right corner like the
 * poster art. No outer card, no numbering, no repeated group kicker: the
 * section heading carries the group. Groups from projectGroups.js (shared
 * with the home index), three across. Static HTML is complete; hover is
 * CSS. */
const grouped = groupProjects(projectsData);

// The 600w sibling serves tiles up to ~2x of their width; the 1200w covers
// wide single-column phones.
const small = (src) => src.replace(/\.webp$/, '-600.webp');

const CaseStudiesPage = () => {
  const rootRef = useRef(null);
  /* One call per page (module-level latches): head and groups in one
   * stagger on client navigation; a direct load keeps the static HTML. */
  usePageHeaderReveal(rootRef, '.page-head-animate, .pt__group');
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

        <div className="pt">
          {grouped.map((g) => (
            <section className={`pt__group pt__group--${g.color}`} key={g.heading} aria-label={g.heading}>
              <h2 className="pt__heading">{g.heading}</h2>
              <div className="pt__grid">
                {g.projects.map((p) => {
                  const src = p.preview || p.imageSrc;
                  const line = [p.indexLine, p.studioProject && 'Studio project'].filter(Boolean).join(' · ');
                  return (
                    <Link key={p.slug} to={`/projects/${p.slug}`} className="pt__card">
                      {/* Poster corner meta: type left, year right. */}
                      <span className="pt__meta">
                        <span className="pt__meta-type">{p.type}</span>
                        {p.year && <span className="pt__meta-year">{p.year}</span>}
                      </span>
                      <span className="pt__top">
                        <span className="pt__title">{p.title}</span>
                        {line && <span className="pt__line">{line}</span>}
                      </span>
                      {p.indexMetric && (
                        <span className="pt__figure">
                          <span className="pt__value">{p.indexMetric.value}</span>
                          <span className="pt__label">{p.indexMetric.label}</span>
                        </span>
                      )}
                      {/* The site, bleeding off the bottom-right corner like
                          the poster art, never boxed. */}
                      <img
                        className="pt__shot"
                        src={small(src)}
                        srcSet={`${small(src)} 600w, ${src} 1200w`}
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 34vw, 24vw"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="375"
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
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
