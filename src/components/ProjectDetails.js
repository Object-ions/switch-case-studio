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
  heightPct: 70.0188,
};

// --- Sub-Component: Editorial Scope List ---
const ScopeList = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="project-details__scope-group">
      <h3 className="project-details__section-label">Scope & Results</h3>
      <ul className="project-details__scope-list">
        {highlights.map((item, idx) => (
          <li key={idx} className="project-details__scope-item">
            <span className="project-details__scope-title">{item.title}</span>
            <span className="project-details__scope-summary">{item.summary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProjectDetails = ({ project, onClose }) => {
  const data = project || {};
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

  const publicLongWeb = longWeb ? process.env.PUBLIC_URL + longWeb : null;
  const publicImageSrc = imageSrc ? process.env.PUBLIC_URL + imageSrc : null;
  const mockupOK = useImagePreload(publicLongWeb);

  // --- GSAP Animation ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Initial States
      gsap.set('.project-details__media', { clipPath: 'inset(0 100% 0 0)' });
      gsap.set('.project-details__content-inner', { y: 20, opacity: 0 });
      gsap.set(rootRef.current, { opacity: 1 });

      // Animation Sequence
      tl.to('.project-details__media', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
      })
      .to('.project-details__content-inner', {
        y: 0, 
        opacity: 1, 
        duration: 0.6,
        stagger: 0.1
      }, "-=0.4");

    }, rootRef);
    return () => ctx.revert();
  }, [slug]);

  const handleScroll = (e, setter) => {
    setter(e.currentTarget.scrollTop > 10);
  };

  return (
    <section ref={rootRef} className="project-details" aria-label="Project details">
      
      {/* --- Mobile Header (Fixed) --- */}
      <header className="project-details__mobile-header">
        <button className="project-details__back-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faArrowLeft} /> {backLabel}
        </button>
      </header>

      {/* --- LEFT COLUMN: Visuals --- */}
      <div 
        className="project-details__media"
        onScroll={(e) => handleScroll(e, setScrolledMedia)}
      >
        <div className="project-details__media-inner">
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

          {publicImageSrc && (
            <img
              src={publicImageSrc}
              alt={imageAlt || `${title} detail`}
              className="project-details__img"
              onClick={() => setZoomOpen(true)}
              loading="eager"
            />
          )}
        </div>
        <Arrow side="left" hidden={scrolledMedia} />
      </div>

      {/* --- RIGHT COLUMN: Info Panel --- */}
      <div className="project-details__panel">
        
        {/* Desktop Header */}
        <header className="project-details__desktop-header">
          <button className="project-details__back-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} /> {backLabel}
          </button>
          <button className="project-details__close-btn" onClick={onClose}>×</button>
        </header>

        <div 
          className="project-details__scroll"
          onScroll={(e) => handleScroll(e, setScrolledPanel)}
        >
          <div className="project-details__content-inner">
            
            {/* Title Block */}
            <div className="project-details__intro">
              <h1 className="project-details__title">{title}</h1>
              {subtitle && <p className="project-details__subtitle">{subtitle}</p>}
              
              {/* Tags moved up for immediate context */}
              {services.length > 0 && (
                <div className="project-details__tags">
                  {services.map((s) => (
                    <span key={s.label} className="project-details__tag">{s.label}</span>
                  ))}
                </div>
              )}

              {description && <p className="project-details__desc">{description}</p>}
            </div>

            <hr className="project-details__divider" />

            {/* Scope List (Refactored) */}
            <ScopeList highlights={highlights} />

            {/* Results Block */}
            {result && (
              <div className="project-details__result-block">
                <h3 className="project-details__section-label">Result</h3>
                <p className="project-details__result-text">{result}</p>
              </div>
            )}

            {/* Spacer for bottom CTA */}
            <div className="project-details__spacer" />
          </div>
          
          <Arrow side="right" hidden={scrolledPanel} />
        </div>

        {/* Sticky Footer CTA */}
        {(ctaUrl || ctaLabel) && (
          <div className="project-details__cta-bar">
            <div className="project-details__cta-info">
              <span className="project-details__cta-kicker">{kicker}</span>
              <span className="project-details__cta-product">{productName}</span>
            </div>
            {ctaUrl && (
              <a 
                href={ctaUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-details__cta-button"
              >
                {ctaLabel} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
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

function useImagePreload(src) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!src) { setLoaded(false); return; }
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
  }, [src]);
  return loaded;
}

export default ProjectDetails;