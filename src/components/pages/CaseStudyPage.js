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

import ScrollingShot from '../ui/ScrollingShot';
import ZoomLightbox from '../ui/ZoomLightbox';
import MagneticButton from '../ui/MagneticButton';

import '../../styles/components/projectPage.scss';

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

const CaseStudyPage = () => {
  const { slug } = useParams();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);

  // null = closed. Holds the src of the image being zoomed (any media tile).
  const [zoomSrc, setZoomSrc] = useState(null);

  // Find project + compute neighbour for "View next →"
  const { project, nextProject } = useMemo(() => {
    const idx = projectsData.findIndex((p) => p.slug === slug);
    if (idx === -1) return { project: null, nextProject: null };
    return {
      project: projectsData[idx],
      nextProject: projectsData[(idx + 1) % projectsData.length],
    };
  }, [slug]);

  const publicLongWeb = project?.longWeb ? project.longWeb : null;
  const publicImageSrc = project?.imageSrc ? project.imageSrc : null;

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
    ctaLabel,
    ctaUrl,
    imageAlt,
    // ── Optional bento media. Each tile renders ONLY if its field exists. ──
    mediaMobile,
    mediaMobileAlt,
    mediaCopy,
    mediaCopyAlt,
    mediaCta,
    mediaCtaAlt,
  } = project;

  const metaDescription =
    outcome ||
    description?.slice(0, 155) ||
    `${title} — case study by Switch Case Studio.`;

  /* ── Media tiles, declared once, rendered conditionally ──
     Missing data → tile is filtered out, so no empty placeholder boxes.
     `longWeb`/`imageSrc` fill two slots today; the rest are optional
     fields you can add to projects.json later and they light up. */

  // Small tiles that live in the Results column (right of the summary).
  const detailTiles = [
    mediaMobile && {
      key: 'mobile',
      src: mediaMobile,
      caption: 'Mobile view',
      alt: mediaMobileAlt || `${title} — mobile view`,
      zoom: true,
    },
    publicImageSrc &&
      detailImageOK && {
        key: 'hero-detail',
        src: publicImageSrc,
        caption: 'Hero detail',
        alt: imageAlt || `${title} — hero detail`,
        zoom: true,
      },
  ].filter(Boolean);

  // The live desktop preview leads the page as a hero band (see below).
  const liveOK = !!(publicLongWeb && mockupOK);

  // Supporting shots in the gallery band below the result quote.
  const galleryTiles = [
    mediaCopy && {
      key: 'copy',
      src: mediaCopy,
      caption: 'Copy / offer block',
      alt: mediaCopyAlt || `${title} — copy and offer block`,
      zoom: true,
    },
    mediaCta && {
      key: 'cta',
      src: mediaCta,
      caption: 'CTA / form',
      alt: mediaCtaAlt || `${title} — CTA and form`,
      zoom: true,
    },
  ].filter(Boolean);

  const hasResults = metrics.length > 0 || detailTiles.length > 0;
  const hasSummary = !!description || highlights.length > 0 || hasResults;

  /* ── Reusable image tile (optionally click-to-zoom) ── */
  const ImageTile = ({ tile, className = '' }) => {
    const body = (
      <>
        <img
          src={tile.src}
          alt={tile.alt}
          className="project-page__tile-img"
          loading="lazy"
        />
        {tile.caption && (
          <span className="project-page__tile-caption">{tile.caption}</span>
        )}
      </>
    );

    if (tile.zoom) {
      return (
        <button
          type="button"
          className={`project-page__tile project-page__tile--media project-page__tile--zoom ${className}`}
          onClick={() => setZoomSrc(tile.src)}
          aria-label={`Zoom into ${tile.alt}`}
        >
          {body}
        </button>
      );
    }
    return (
      <figure
        className={`project-page__tile project-page__tile--media ${className}`}
      >
        {body}
      </figure>
    );
  };

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
        className="project-page project-page--bento"
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

          {(ctaUrl || (nextProject && nextProject.slug !== slug)) && (
            <div className="project-page__hero-actions">
              {ctaUrl && (
                <MagneticButton>
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
                </MagneticButton>
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
          )}
        </header>

        {/* ── Live site (hero band) — the real, working proof, up top ── */}
        {liveOK && (
          <section
            className="project-page__live reveal"
            aria-label="Live site preview"
          >
            <div className="project-page__live-tile">
              <span className="project-page__live-badge">
                <span
                  className="project-page__live-dot"
                  aria-hidden="true"
                />
                Live
              </span>
              <ScrollingShot
                key={slug}
                src={publicLongWeb}
                alt={imageAlt || `${title} — landing page`}
              />
            </div>
          </section>
        )}

        {/* ── Summary bento: Overview + Scope (left) · Results (right) ── */}
        {hasSummary && (
          <section
            className="project-page__summary reveal"
            aria-label="Overview, scope and results"
          >
            {(description || highlights.length > 0) && (
              <div className="project-page__col">
                {description && (
                  <div className="project-page__tile project-page__tile--text">
                    <h2 className="project-page__section-label">Overview</h2>
                    <p className="project-page__desc">{description}</p>
                  </div>
                )}

                {highlights.length > 0 && (
                  <div className="project-page__tile project-page__tile--text">
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
                  </div>
                )}
              </div>
            )}

            {hasResults && (
              <div
                className="project-page__col project-page__col--results"
                aria-label="Results"
              >
                <h2 className="project-page__section-label">Results</h2>
                <div className="project-page__results-grid">
                  {metrics.map((m, i) => (
                    <div
                      key={m.label}
                      className={`project-page__tile project-page__metric${
                        i === 0 ? ' project-page__metric--lead' : ''
                      }`}
                    >
                      <span className="project-page__metric-value">
                        {m.value}
                      </span>
                      <span className="project-page__metric-label">
                        {m.label}
                      </span>
                    </div>
                  ))}

                  {detailTiles.map((tile) => (
                    <ImageTile key={tile.key} tile={tile} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Result quote band ── */}
        {result && (
          <section className="project-page__result reveal" aria-label="Outcome">
            <p className="project-page__result-text">{result}</p>
          </section>
        )}

        {/* ── Media gallery bento ── */}
        {galleryTiles.length > 0 && (
          <section
            className="project-page__gallery reveal"
            data-count={galleryTiles.length}
            aria-label="Project visuals"
          >
            {galleryTiles.map((tile) => (
              <ImageTile key={tile.key} tile={tile} />
            ))}
          </section>
        )}

        {/* ── Lightbox (any zoomable tile) ── */}
        {zoomSrc && (
          <ZoomLightbox
            src={zoomSrc}
            alt={imageAlt || title}
            open={!!zoomSrc}
            onClose={() => setZoomSrc(null)}
          />
        )}
      </article>
    </>
  );
};

export default CaseStudyPage;
