import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import projectsData from '../../data/projects.json';
import { groupProjects } from '../../data/projectGroups';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/projectsPage.scss';

/* /projects (2026-09-27, third pass, owner: "let's try something else"):
 * every project is a POSTER TILE, in the service posters' frame. The card
 * carries the group as its kicker, the title and the index line; the
 * square plate below wears the group's colour and the poster grain, corner
 * meta (number, type), the real site shot on a cream mount, and the
 * project's one measured figure (`indexMetric`, value verbatim from its
 * `metrics[]`) as the poster headline. A project with no figure headlines
 * its type. Groups stay as sections (projectGroups.js, shared with the home
 * index), three tiles across. Static HTML is complete; hover is CSS. */
const grouped = groupProjects(projectsData);

// The 600w sibling serves tiles up to ~2x of their width; the 1200w covers
// wide single-column phones.
const small = (src) => src.replace(/\.webp$/, '-600.webp');

const CaseStudiesPage = () => {
  const rootRef = useRef(null);
  /* One call per page (module-level latches): head and groups in one
   * stagger on client navigation; a direct load keeps the static HTML. */
  usePageHeaderReveal(rootRef, '.page-head-animate, .pt__group');
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

        <div className="pt">
          {grouped.map((g) => (
            <section className={`pt__group pt__group--${g.color}`} key={g.heading} aria-label={g.heading}>
              <h2 className="pt__heading">{g.heading}</h2>
              <div className="pt__grid">
                {g.projects.map((p) => {
                  n += 1;
                  const num = String(n).padStart(2, '0');
                  const src = p.preview || p.imageSrc;
                  const line = [p.indexLine, p.studioProject && 'Studio project'].filter(Boolean).join(' · ');
                  return (
                    <Link key={p.slug} to={`/projects/${p.slug}`} className="pt__card">
                      <span className="pt__meta">
                        <span className="pt__meta-kicker">{g.heading}</span>
                        {p.year && <span className="pt__meta-year">{p.year}</span>}
                      </span>
                      <span className="pt__title">{p.title}</span>
                      {line && <span className="pt__line">{line}</span>}
                      <span className="pt__plate">
                        <span className="pt__corner pt__corner--tl">{num}</span>
                        <span className="pt__corner pt__corner--tr">{p.type}</span>
                        <img
                          className="pt__shot"
                          src={small(src)}
                          srcSet={`${small(src)} 600w, ${src} 1200w`}
                          sizes="(max-width: 768px) 86vw, (max-width: 1024px) 40vw, 30vw"
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="375"
                        />
                        <span className={`pt__headline${p.indexMetric ? '' : ' pt__headline--type'}`}>
                          {p.indexMetric ? p.indexMetric.value : p.type}
                        </span>
                        {p.indexMetric && <span className="pt__label">{p.indexMetric.label}</span>}
                      </span>
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
