import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

import projectsData from '../../data/projects.json';
import useReducedMotion from '../../hooks/useReducedMotion';

import DeviceMockup from '../DeviceMockup';
import ZoomLightbox from '../ZoomLightbox';
import macbookFrame from '../../assets/mockups/macbook-frame.png';

import '../../styles/components/projectPage.scss';

const DEFAULT_VIEWPORT = {
  leftPct: 17.8468,
  topPct: 14.9473,
  widthPct: 64.4509,
  heightPct: 70.0188,
};

/* ── Image preload (returns true when image loads, false on error) ── */
const useImagePreload = (src) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!src) {
      setLoaded(false);
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
  }, [src]);
  return loaded;
};

const ProjectPage = () => {
  const { slug } = useParams();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);

  const [zoomOpen, setZoomOpen] = useState(false);

  // Find project + compute neighbour for "View next →"
  const { project, nextProject } = useMemo(() => {
    const idx = projectsData.findIndex((p) => p.slug === slug);
    if (idx === -1) return { project: null, nextProject: null };
    return {
      project: projectsData[idx],
      nextProject: projectsData[(idx + 1) % projectsData.length],
    };
  }, [slug]);

  const publicLongWeb = project?.longWeb
    ? process.env.PUBLIC_URL + project.longWeb
    : null;
  const publicImageSrc = project?.imageSrc
    ? process.env.PUBLIC_URL + project.imageSrc
    : null;

  const mockupOK = useImagePreload(publicLongWeb);
  const detailImageOK = useImagePreload(publicImageSrc);

  /* ── Entrance animation. GSAP owns start + end state. ── */
  useLayoutEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray('.reveal', rootRef.current);

      if (reducedMotion) {
        gsap.set(reveals, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(reveals, { autoAlpha: 0, y: 30 });
      gsap.to(reveals, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [project, reducedMotion]);

  /* ── 404 fallback ── */
  if (!project) {
    return <Navigate to="/" replace />;
  }

  const {
    title,
    subtitle,
    outcome,
    year,
    description,
    services = [],
    highlights = [],
    metrics = [],
    result,
    kicker,
    productName,
    ctaLabel,
    ctaUrl,
    imageAlt,
    viewport,
  } = project;

  const metaDescription =
    outcome ||
    description?.slice(0, 155) ||
    `${title} — case study by Switch Case Studio.`;

  return (
    <>
      <Helmet>
        <title>{`${title} — Switch Case Studio`}</title>
        <meta name="description" content={metaDescription} />
        <link
          rel="canonical"
          href={`https://switchcasestudio.com/projects/${slug}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${title} — Switch Case Studio`} />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:url"
          content={`https://switchcasestudio.com/projects/${slug}`}
        />
        {publicImageSrc && (
          <meta
            property="og:image"
            content={`https://switchcasestudio.com${project.imageSrc}`}
          />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} — Switch Case Studio`} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>

      <article
        className="project-page"
        ref={rootRef}
        aria-labelledby="project-title"
      >
        {/* ── Top bar ── */}
        <nav className="project-page__topbar" aria-label="Project navigation">
          <Link
            to="/#projects"
            className="project-page__back"
            aria-label="Back to selected work"
          >
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            <span>Back to Selected Work</span>
          </Link>
        </nav>

        {/* ── Hero ── */}
        <header className="project-page__hero reveal">
          {(kicker || year) && (
            <p className="project-page__kicker">
              {[kicker, year].filter(Boolean).join(' · ')}
            </p>
          )}

          <h1 id="project-title" className="project-page__title">
            {title}
          </h1>

          {(outcome || subtitle) && (
            <p className="project-page__lede">{outcome || subtitle}</p>
          )}

          {services.length > 0 && (
            <ul className="project-page__tags" aria-label="Services delivered">
              {services.map((s) => (
                <li key={s.label} className="project-page__tag">
                  {s.label.replace(/^#/, '')}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* ── Scope + Metrics two-column ── */}
        <section
          className="project-page__scope-grid reveal"
          aria-label="Scope and metrics"
        >
          {description && (
            <div className="project-page__scope-narrative">
              <h2 className="project-page__section-label">Overview</h2>
              <p className="project-page__desc">{description}</p>

              {highlights.length > 0 && (
                <>
                  <h2 className="project-page__section-label">Scope</h2>
                  <dl className="project-page__scope-list">
                    {highlights.map((item) => (
                      <div
                        key={item.title}
                        className="project-page__scope-item"
                      >
                        <dt className="project-page__scope-title">
                          {item.title}
                        </dt>
                        <dd className="project-page__scope-summary">
                          {item.summary}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          )}

          {metrics.length > 0 && (
            <aside
              className="project-page__metrics"
              aria-label="Project metrics"
            >
              <h2 className="project-page__section-label">Results</h2>
              <ul className="project-page__metrics-list">
                {metrics.map((m) => (
                  <li key={m.label} className="project-page__metric">
                    <span className="project-page__metric-value">
                      {m.value}
                    </span>
                    <span className="project-page__metric-label">
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </section>

        {/* ── Result block ── */}
        {result && (
          <section className="project-page__result reveal" aria-label="Outcome">
            <h2 className="project-page__section-label">Outcome</h2>
            <p className="project-page__result-text">{result}</p>
          </section>
        )}

        {/* ── Device mockup (if available) ── */}
        {mockupOK && publicLongWeb && (
          <section
            className="project-page__media-block reveal"
            aria-label="Live site preview"
          >
            <DeviceMockup
              key={slug}
              frameSrc={macbookFrame}
              contentSrc={publicLongWeb}
              alt={imageAlt || `${title} preview`}
              viewport={viewport || DEFAULT_VIEWPORT}
              speed={35}
              hold={0.6}
              pauseOnHover
              controls
              className="project-page__mockup"
            />
          </section>
        )}

        {/* ── Detail image (if available, click to zoom) ── */}
        {detailImageOK && publicImageSrc && (
          <section
            className="project-page__media-block reveal"
            aria-label="Project detail image"
          >
            <button
              type="button"
              className="project-page__img-trigger"
              onClick={() => setZoomOpen(true)}
              aria-label={`Zoom into ${imageAlt || title}`}
            >
              <img
                src={publicImageSrc}
                alt={imageAlt || `${title} detail`}
                className="project-page__img"
                loading="lazy"
              />
              <span className="project-page__img-hint">Click to zoom</span>
            </button>
          </section>
        )}

        {/* ── CTA bar ── */}
        <footer className="project-page__cta-bar reveal">
          <div className="project-page__cta-info">
            {kicker && (
              <span className="project-page__cta-kicker">{kicker}</span>
            )}
            {productName && (
              <span className="project-page__cta-product">{productName}</span>
            )}
          </div>

          <div className="project-page__cta-actions">
            {ctaUrl && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-page__cta-button project-page__cta-button--primary"
              >
                {ctaLabel || 'View Live'}{' '}
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  aria-hidden="true"
                />
              </a>
            )}

            {nextProject && nextProject.slug !== slug && (
              <Link
                to={`/projects/${nextProject.slug}`}
                className="project-page__cta-button project-page__cta-button--secondary"
              >
                Next: {nextProject.title}{' '}
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            )}
          </div>
        </footer>

        {/* ── Lightbox ── */}
        {detailImageOK && publicImageSrc && (
          <ZoomLightbox
            src={publicImageSrc}
            alt={imageAlt || title}
            open={zoomOpen}
            onClose={() => setZoomOpen(false)}
          />
        )}
      </article>
    </>
  );
};

export default ProjectPage;
