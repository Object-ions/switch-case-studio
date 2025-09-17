import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Arrow from "./Arrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import DeviceMockup from "./DeviceMockup";
import macbookFrame from "../assets/mockups/macbook-frame.png";
import zahavLong from "../assets/projects/zahav-long.webp";
import zahavlayout from "../assets/projects/zahav-1.avif";

import projectsData from "../data/projects.json";
import "../styles/components/projectDetails.scss";

const ProjectDetails = ({ onClose }) => {
  const data = projectsData[0];
  const [scrolledMedia, setScrolledMedia] = useState(false);
  const [scrolledPanel, setScrolledPanel] = useState(false);

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
        <DeviceMockup
          frameSrc={macbookFrame}
          contentSrc={zahavLong}
          alt="Zahav Medspa homepage preview"
          viewport={{
            leftPct: 17.8468,
            topPct: 14.9473,
            widthPct: 64.4509,
            heightPct: 77.0188,
          }}
          speed={35}
          hold={0.6}
          pauseOnHover
          controls
          className="project-details__mockup"
        />
        <img src={zahavlayout} alt="" style={{ width: "100%" }} />

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
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Projects
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
              <h1 className="project-details__title">{data.title}</h1>
              <p className="project-details__subtitle">{data.subtitle}</p>
              <p className="project-details__desc">{data.description}</p>

              <nav className="project-details__socials" aria-label="Services">
                {data.services.map((s) => (
                  <p key={s.label} className="project-details__social">
                    {s.label}
                  </p>
                ))}
              </nav>
            </div>

            {/* BOTTOM BLOCK */}
            <div ref={bottomRef} className="project-details__bottom">
              <section className="project-details__cta">
                <div>
                  <hr />
                  <p className="project-details__kicker">Our Work</p>
                  <h2 className="project-details__product">in Detail</h2>
                </div>
                <a
                  href={data.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-details__button"
                >
                  View Live <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </section>

              <section
                className="project-details__scope"
                aria-label="Scope & Results"
              >
                <h2 className="project-details__scopeHeading">
                  Scope & Results
                </h2>
                <ul className="project-details__scopeList">
                  {data.highlights?.map((item) => (
                    <li key={item.title} className="project-details__scopeItem">
                      <h3 className="project-details__scopeTitle">
                        {item.title}
                      </h3>
                      <p className="project-details__scopeSummary">
                        {item.summary}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="project-details__result">
                  <h3 className="project-details__resultHeading">Result</h3>
                  <p className="project-details__resultText">{data.result}</p>
                </div>
              </section>
            </div>
          </main>

          <div className="project-details__divider" role="separator" />
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
