import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Arrow from "./Arrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import DeviceMockup from "./DeviceMockup";
import ZoomLightbox from "./ZoomLightbox";

import macbookFrame from "../assets/mockups/macbook-frame.png";
import "../styles/components/projectDetails.scss";

const DEFAULT_VIEWPORT = {
  leftPct: 17.8468,
  topPct: 14.9473,
  widthPct: 64.4509,
  heightPct: 77.0188,
};

const ProjectDetails = ({ project, onClose }) => {
  // Guard: if something goes wrong, avoid crashing
  const data = project ?? {};

  const {
    title = "Untitled Project",
    subtitle = "",
    description = "",
    imageSrc,
    imageAlt,
    longWeb,
    services = [],
    highlights = [],
    result = "",
    kicker = "In depth on",
    productName = "Our Work",
    ctaLabel = "View Live",
    ctaUrl,
    backLabel = "Back to Projects",
    viewport,
  } = data;

  const [scrolledMedia, setScrolledMedia] = useState(false);
  const [scrolledPanel, setScrolledPanel] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // GSAP refs
  const rootRef = useRef(null);
  const mediaRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Initial states
      gsap.set(mediaRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(headerRef.current, { y: -20, opacity: 0 });
      gsap.set(mainRef.current, { y: 20, opacity: 0 });
      gsap.set(bottomRef.current, { y: 30, opacity: 0 });
      gsap.set(rootRef.current, { opacity: 1 });

      // Sequence
      tl.to(mediaRef.current, { clipPath: "inset(0 0% 0 0)", duration: 1 })
        .to(headerRef.current, { y: 0, opacity: 1, duration: 0.6 }, 0.3)
        .to(mainRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.6)
        .to(bottomRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.9);

      tl.fromTo(
        panelRef.current,
        { boxShadow: "0 0 0 rgba(0,0,0,0)" },
        { boxShadow: "0 8px 24px rgba(0,0,0,0.08)", duration: 0.4 },
        0.25
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const mockupAlt =
    imageAlt || `${title} homepage preview` || "Project preview";

  return (
    <section
      ref={rootRef}
      className="project-details"
      aria-label="Project details"
    >
      {/* LEFT: image/media */}
      <div
        ref={mediaRef}
        className="project-details__media"
        aria-label="Project preview"
        onScroll={(e) => {
          if (!scrolledMedia && e.currentTarget.scrollTop > 4)
            setScrolledMedia(true);
        }}
      >
        {longWeb && (
          <DeviceMockup
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
            style={{ width: "100%", cursor: "zoom-in" }}
            onClick={() => setZoomOpen(true)}
          />
        )}

        <Arrow side="left" hidden={scrolledMedia} />
      </div>

      {/* RIGHT: panel */}
      <div ref={panelRef} className="project-details__panel">
        <header ref={headerRef} className="project-details__header">
          <button
            className="project-details__back"
            type="button"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> {backLabel}
          </button>
          <button
            className="project-details__close"
            type="button"
            aria-label="Close project details"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div
          className="project-details__scroll"
          onScroll={(e) => {
            if (!scrolledPanel && e.currentTarget.scrollTop > 4) {
              setScrolledPanel(true);
            }
          }}
        >
          <Arrow side="right" hidden={scrolledPanel} />

          <main ref={mainRef} className="project-details__main">
            <div className="project-details__content">
              <h1 className="project-details__title">{title}</h1>
              {subtitle && (
                <p className="project-details__subtitle">{subtitle}</p>
              )}
              {description && (
                <p className="project-details__desc">{description}</p>
              )}

              {!!services.length && (
                <nav className="project-details__socials" aria-label="Services">
                  {services.map((s) => (
                    <p key={s.label} className="project-details__social">
                      {s.label}
                    </p>
                  ))}
                </nav>
              )}
            </div>

            {/* BOTTOM BLOCK */}
            <div ref={bottomRef} className="project-details__bottom">
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
                      {ctaLabel}{" "}
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                  )}
                </section>
              )}

              {(highlights.length || result) && (
                <section
                  className="project-details__scope"
                  aria-label="Scope & Results"
                >
                  {!!highlights.length && (
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

          <div className="project-details__divider" role="separator" />
        </div>
      </div>

      {/* Lightbox */}
      {imageSrc && (
        <ZoomLightbox
          src={imageSrc}
          alt={imageAlt || `${title} detail`}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </section>
  );
};

export default ProjectDetails;
