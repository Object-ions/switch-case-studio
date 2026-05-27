import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import projectsData from '../../data/projects.json';
import '../../styles/components/projectsPage.scss';

const ProjectsPage = () => {

  return (
    <>
      <Helmet>
        <title>Case Studies — Switch Case Studio</title>
        <meta
          name="description"
          content="Browse Switch Case Studio's portfolio — websites, e-commerce stores, and apps built from scratch for clients across the US."
        />
        <link rel="canonical" href="https://switchcasestudio.com/projects" />
        <meta property="og:title" content="Case Studies — Switch Case Studio" />
        <meta
          property="og:description"
          content="Websites, e-commerce stores, and apps built from scratch for clients across the US."
        />
      </Helmet>

      <article className="projects-page" aria-label="Case studies">
        {/* ── Header ── */}
        <header className="projects-page__header">
          <p className="projects-page__kicker">Portfolio</p>
          <h1 className="projects-page__title">Selected Work</h1>
          <p className="projects-page__lede">
            {projectsData.length} projects. All built from scratch.
          </p>
        </header>

        {/* ── Grid ── */}
        <section className="projects-page__grid" aria-label="Project list">
          {projectsData.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="projects-page__card"
              aria-label={`View case study: ${project.title}`}
            >
              <div className="projects-page__card-img">
                <img
                  src={process.env.PUBLIC_URL + project.coverTile}
                  alt={project.imageAlt || project.title}
                  loading="lazy"
                />
              </div>
              <div className="projects-page__card-body">
                <div className="projects-page__card-meta">
                  {project.year && (
                    <span className="projects-page__card-year">{project.year}</span>
                  )}
                  {project.kicker && (
                    <span className="projects-page__card-kicker">{project.kicker}</span>
                  )}
                </div>
                <h2 className="projects-page__card-title">{project.title}</h2>
                {project.subtitle && (
                  <p className="projects-page__card-sub">{project.subtitle}</p>
                )}
                {project.services?.length > 0 && (
                  <ul className="projects-page__card-tags" aria-label="Services">
                    {project.services.slice(0, 3).map((s) => (
                      <li key={s.label} className="projects-page__card-tag">
                        {s.label.replace(/^#/, '')}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="projects-page__card-cta" aria-hidden="true">
                  View case study →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Bottom CTA ── */}
        <div className="projects-page__bottom">
          <p className="projects-page__bottom-text">
            Want to see what we can build for you?
          </p>
          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            target="_blank"
            rel="noopener noreferrer"
            className="projects-page__bottom-btn"
          >
            Book a Free Call
          </a>
        </div>
      </article>
    </>
  );
};

export default ProjectsPage;
