import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import Arrow from './Arrow';
import DeviceMockup from './DeviceMockup';
import ZoomLightbox from './ZoomLightbox';
import macbookFrame from '../assets/mockups/macbook-frame.png';
import '../styles/components/projectDetails.scss';

const DEFAULT_VIEWPORT = {
  leftPct: 17.8468,
  topPct: 14.9473,
  widthPct: 64.4509,
  heightPct: 77.0188,
};

// --- Helper Component: Scope & Results ---
// Extracted to keep the main component clean
const ScopeList = ({ highlights, result }) => {
  if ((!highlights || highlights.length === 0) && !result) return null;

  return (
    <section className="project-details__scope">
      {highlights && highlights.length > 0 && (
        <>
          <h2 className="project-details__scopeHeading">Scope & Results</h2>
          <ul className="project-details__scopeList">
            {highlights.map((item, idx) => (
              <li key={idx} className="project-details__scopeItem">
                <h3 className="project-details__scopeTitle">{item.title}</h3>
                <p className="project-details__scopeSummary">{item.summary}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {result && (
        <div className="project-details__result">
          <h3 className="project-details__resultHeading">Result</h3>
          <p className="project-details__resultText">{result}</p>
        </div>
      )}
    </section>
  );
};

const ProjectDetails = ({ project, onClose }) => {
  // 1. Safe Data Access
  const data = project || {};
  const {
    slug,
    title = 'Untitled Project',
    subtitle,
    description,
    imageSrc,  // Path string from JSON
    imageAlt,
    longWeb,   // Path string from JSON
    services = [],
    highlights = [],
    result,
    kicker = 'In depth on',
    productName = 'Our Work',
    ctaLabel = 'View Live',
    ctaUrl,
    backLabel = 'Back to Projects',
    viewport,
  } = data;

  const rootRef = useRef(null);
  const [scrolledMedia, setScrolledMedia] = useState(false);
  const [scrolledPanel, setScrolledPanel] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // 2. Resolve Public Paths
  // This ensures images load correctly from the public folder
  const publicLongWeb = longWeb ? process.env.PUBLIC_URL + longWeb : null;
  const publicImageSrc = imageSrc ? process.env.PUBLIC_URL + imageSrc : null;

  // 3. Preload logic
  const mockupOK = useImagePreload(publicLongWeb);

  // 4. GSAP Entrance Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Init State
      gsap.set('.project-details__media', { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(
        ['.project-details__header', '.project-details__main', '.project-details__bottom'],
        { y: 20, opacity: 0 }
      );
      gsap.set(rootRef.current, { opacity: 1 });

      // Sequence
      tl.to('.project-details__media', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
      })
        .to('.project-details__header', { y: 0, opacity: 1, duration: 0.6 }, 0.3)
        .to('.project-details__main', { y: 0, opacity: 1, duration: 0.8 }, 0.5)
        .to('.project-details__bottom', { y: 0, opacity: 1, duration: 0.8 }, 0.7)
        .fromTo(
          '.project-details__panel',
          { boxShadow: '0 0 0 rgba(0,0,0,0)' },
          { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', duration: 0.4 },
          0.25
        );
    }, rootRef);

    return () => ctx.revert();
  }, [slug]);

  // Scroll UI Feedback
  const handleScroll = (e, setter) => {
    setter(e.currentTarget.scrollTop > 10);
  };

  return (
    <section
      ref={rootRef}
      className="project-details"
      aria-label="Project details"
    >
      {/* LEFT: Media Column */}
      <div
        className="project-details__media"
        onScroll={(e) => handleScroll(e, setScrolledMedia)}
      >
        {/* Render Device Mockup if longWeb exists */}
        {mockupOK && publicLongWeb && (
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
            className="project-details__mockup"
          />
        )}

        {/* Render Standard Image if imageSrc exists */}
        {publicImageSrc && (
          <img
            src={publicImageSrc}
            alt={imageAlt || `${title} detail`}
            className="project-details__img"
            onClick={() => setZoomOpen(true)}
            loading="eager"
          />
        )}

        <Arrow side="left" hidden={scrolledMedia} />
      </div>

      {/* RIGHT: Content Column */}
      <div className="project-details__panel">
        <header className="project-details__header">
          <button className="project-details__back" onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} /> {backLabel}
          </button>
          <button className="project-details__close" onClick={onClose}>
            ×
          </button>
        </header>

        <div
          className="project-details__scroll"
          onScroll={(e) => handleScroll(e, setScrolledPanel)}
        >
          <Arrow side="right" hidden={scrolledPanel} />

          <main className="project-details__main">
            <div className="project-details__content">
              <h1 className="project-details__title">{title}</h1>
              {subtitle && (
                <p className="project-details__subtitle">{subtitle}</p>
              )}
              {description && (
                <p className="project-details__desc">{description}</p>
              )}

              {services.length > 0 && (
                <nav className="project-details__socials">
                  {services.map((s) => (
                    <span key={s.label} className="project-details__social">
                      {s.label}
                    </span>
                  ))}
                </nav>
              )}
            </div>

            <div className="project-details__bottom">
              {(ctaUrl || ctaLabel) && (
                <section className="project-details__cta">
                  <div>
                    <hr />
                    <p className="project-details__kicker">{kicker}</p>
                    <h2 className="project-details__product">{productName}</h2>
                  </div>
                  {ctaUrl && (
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-details__button"
                    >
                      {ctaLabel}{' '}
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                  )}
                </section>
              )}

              {/* Scope & Results (Helper Component) */}
              <ScopeList highlights={highlights} result={result} />
            </div>
          </main>
          <div className="project-details__divider" aria-hidden="true" />
        </div>
      </div>

      {publicImageSrc && (
        <ZoomLightbox
          src={publicImageSrc}
          alt={imageAlt || title}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </section>
  );
};

// --- Custom Hook ---
function useImagePreload(src) {
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
}

export default ProjectDetails;