import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ProjectDetails from "./ProjectDetails";
import useScrollLock from "../hooks/useScrollLock";

import projectsData from "../data/projects.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/components/projects.scss";

/**
 * Base tiles: layout class + visible label.
 * We merge each with the matching record from projects.json by id.
 */
const BASE_PROJECTS = [
  { id: 1, label: "Zahav Medspa", panelClass: "panel-hero" },
  { id: 2, label: "ProDani Miami", panelClass: "panel-card-1" },
  { id: 3, label: "PROJECT B", panelClass: "panel-card-2" },
  { id: 4, label: "PROJECT C", panelClass: "panel-card-3" },
];

const PROJECTS = BASE_PROJECTS.map((p) => ({
  ...p,
  ...(projectsData.find((d) => d.id === p.id) || {}),
}));

const Projects = () => {
  const [openId, setOpenId] = useState(null); // number | null
  const [hoverId, setHoverId] = useState(null); // number | null
  useScrollLock(Boolean(openId));

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = useCallback((id) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  const active = PROJECTS.find((p) => p.id === openId);

  const onTileKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(id);
    }
  };

  return (
    <section className="projects" aria-label="project overview">
      {/* Header marquee */}
      <div className="panel panel-header">
        <h1 className="marquee" aria-label="Selected Projects">
          <span className="marquee-track">
            Selected Projects · Selected Projects · Selected Projects · Selected
            Projects · Selected Projects ·
          </span>
          <span className="marquee-track" aria-hidden="true">
            Selected Projects · Selected Projects · Selected Projects · Selected
            Projects · Selected Projects ·
          </span>
        </h1>
      </div>

      {/* Four project tiles */}
      {PROJECTS.slice(0, 4).map((proj) => (
        <div
          key={proj.id}
          className={`panel ${proj.panelClass}`}
          role="button"
          tabIndex={0}
          onClick={() => open(proj.id)}
          onKeyDown={(e) => onTileKey(e, proj.id)}
          onMouseEnter={() => setHoverId(proj.id)}
          onMouseLeave={() => setHoverId(null)}
          aria-label={`Open ${proj.label} details`}
          {...(proj.panelClass === "panel-card-3"
            ? { "data-cursor-color": "#fff" }
            : {})}
        >
          <span className="panel-label">
            {hoverId === proj.id ? `About ${proj.label}` : proj.label}
          </span>

          {/* tileVersion copy appears under label on hover if available */}
          {hoverId === proj.id && proj.tileVersion && (
            <p className="panel-excerpt">
              {proj.tileVersion}
              <br />
              <b>Click to View</b> <FontAwesomeIcon icon={faArrowRight} />
            </p>
          )}
        </div>
      ))}

      {/* Row 3 informational panels */}
      <div className="panel panel-about">
        <h3>WHAT’S BEHIND THE TILE?</h3>
        <p>Hover to Explore</p>
        <p>
          Move over a project to reveal its story. <b> Click to dive deeper</b>{" "}
          in a popup view.
        </p>
      </div>

      <div className="panel panel-tagline">
        <span>WEB · BRAND · INTERACTIVE</span>
      </div>

      <div className="panel panel-link">
        <span>Book a Free Consultaion</span>
      </div>

      {/* Details overlay */}
      {active &&
        createPortal(
          <div
            className="project-details-overlay"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="project-details-overlay__backdrop"
              aria-hidden="true"
              onClick={close}
            />
            <ProjectDetails project={active} onClose={close} />
          </div>,
          document.body
        )}
    </section>
  );
};

export default Projects;
