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

const ProjectDetails = ({ project, onClose }) => {
  const data = project ?? {};
  const {
    slug,
    title = 'Untitled Project',
    subtitle,
    description,
    imageSrc,
    imageAlt,
    longWeb,
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

  // Helper hook to ensure Mockup image exists before rendering
  const mockupOK = useImagePreload(longWeb);

  // GSAP Animation using Scoped Selectors (No extra refs needed!)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Initial Setups
      gsap.set('.project-details__media', { clipPath: 'inset(0 100% 0 0)' });
      gsap.set('.project-details__header', { y: -20, opacity: 0 });
      gsap.set('.project-details__main', { y: 20, opacity: 0 });
      gsap.set('.project-details__bottom', { y: 30, opacity: 0 });
      gsap.set(rootRef.current, { opacity: 1 }); // Reveal container

      // Animation Sequence
      tl.to('.project-details__media', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
      })
        .to(
          '.project-details__header',
          { y: 0, opacity: 1, duration: 0.6 },
          0.3
        )
        .to('.project-details__main', { y: 0, opacity: 1, duration: 0.8 }, 0.6)
        .to(
          '.project-details__bottom',
          { y: 0, opacity: 1, duration: 0.8 },
          0.9
        );

      // Panel Shadow
      tl.fromTo(
        '.project-details__panel',
        { boxShadow: '0 0 0 rgba(0,0,0,0)' },
        { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', duration: 0.4 },
        0.25
      );
    }, rootRef); // Scope to rootRef

    return () => ctx.revert();
  }, [slug]); // Re-run if project changes

  // Scroll Handler
  const handleScroll = (e, setter) => {
    const isScrolled = e.currentTarget.scrollTop > 10;
    setter(isScrolled);
  };

  const mockupAlt = imageAlt || `${title} preview`;

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
        {mockupOK && (
          <DeviceMockup
            key={slug} // Remount animation on change
            frameSrc={macbookFrame}
            contentSrc={longWeb}
            alt={mockupAlt}
            viewport={viewport || DEFAULT_VIEWPORT}
            speed={35}
            hold={0.6}
            pauseOnHover
            controls
            className="project-details__mockup"
          />
        )}

        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt || `${title} detail`}
            className="project-details__img"
            onClick={() => setZoomOpen(true)}
          />
        )}

        <Arrow side="left" hidden={scrolledMedia} />
      </div>

      {/* RIGHT: Content Column */}
      <div className="project-details__panel">
        <header className="project-details__header">
          <button
            className="project-details__back"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> {backLabel}
          </button>
          <button
            className="project-details__close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
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

            {/* Bottom: CTA & Scope */}
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

              {(highlights.length > 0 || result) && (
                <section className="project-details__scope">
                  {highlights.length > 0 && (
                    <>
                      <h2 className="project-details__scopeHeading">
                        Scope & Results
                      </h2>
                      <ul className="project-details__scopeList">
                        {highlights.map((item) => (
                          <li
                            key={item.title}
                            className="project-details__scopeItem"
                          >
                            <h3 className="project-details__scopeTitle">
                              {item.title}
                            </h3>
                            <p className="project-details__scopeSummary">
                              {item.summary}
                            </p>
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
              )}
            </div>
          </main>

          {/* Spacer to allow scrolling past bottom content */}
          <div className="project-details__divider" aria-hidden="true" />
        </div>
      </div>

      {imageSrc && (
        <ZoomLightbox
          src={imageSrc}
          alt={imageAlt || title}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </section>
  );
};

// --- Custom Hook for Image Preloading ---
function useImagePreload(src) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src || typeof src !== 'string') {
      setLoaded(false);
      return;
    }

    let active = true;
    const img = new Image();
    img.src = src;
    img.onload = () => active && setLoaded(true);
    img.onerror = () => active && setLoaded(false);

    return () => {
      active = false;
    };
  }, [src]);

  return loaded;
}

export default ProjectDetails;
