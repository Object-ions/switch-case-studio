import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ProjectDetails from "./ProjectDetails";
import "../styles/components/projects.scss";

const PROJECTS = [
  { id: "zahav-medspa", label: "Zahav Medspa" },
  { id: "prodani-miami", label: "ProDani Miami" },
  { id: "project-b", label: "PROJECT B" },
  { id: "project-c", label: "PROJECT C" },
];

const Projects = () => {
  const [openId, setOpenId] = useState(null);

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
      <div className="panel panel-header">
        <h1 className="marquee" aria-label="Selected Projects">
          <span className="marquee-track">
            Selected Projects · Selected Projects · Selected Projects · Selected Projects · Selected Projects ·
          </span>
          <span className="marquee-track" aria-hidden="true">
            Selected Projects · Selected Projects · Selected Projects · Selected Projects · Selected Projects ·
          </span>
        </h1>
      </div>

      <div
        className="panel panel-hero"
        role="button"
        tabIndex={0}
        onClick={() => open("zahav-medspa")}
        onKeyDown={(e) => onTileKey(e, "zahav-medspa")}
        aria-label="Open Zahav Medspa details"
      >
        <span className="panel-label">Zahav Medspa</span>
      </div>

      <div
        className="panel panel-card-1"
        role="button"
        tabIndex={0}
        onClick={() => open("prodani-miami")}
        onKeyDown={(e) => onTileKey(e, "prodani-miami")}
        aria-label="Open ProDani Miami details"
      >
        <span className="panel-label">ProDani Miami</span>
      </div>

      <div
        className="panel panel-card-2"
        role="button"
        tabIndex={0}
        onClick={() => open("project-b")}
        onKeyDown={(e) => onTileKey(e, "project-b")}
        aria-label="Open Project B details"
      >
        <span className="panel-label">PROJECT B</span>
      </div>

      <div
        className="panel panel-card-3"
        role="button"
        tabIndex={0}
        onClick={() => open("project-c")}
        onKeyDown={(e) => onTileKey(e, "project-c")}
        aria-label="Open Project C details"
        data-cursor-color="#fff"
      >
        <span className="panel-label">PROJECT C</span>
      </div>

      <div className="panel panel-about">
        <h3>ABOUT THIS WORK</h3>
        <p>
          Brief context for the selected projects—scope, role, stack, and outcomes. Replace this with per-project copy later.
        </p>
      </div>

      <div className="panel panel-tagline">
        <span>WEB · BRAND · INTERACTIVE</span>
      </div>

      <div className="panel panel-link">
        <span>VIEW ALL</span>
      </div>
      
      {active &&
  createPortal(
    <div className="project-details-overlay" aria-modal="true" role="dialog">
      <div
        className="project-details-overlay__backdrop"
        aria-hidden="true"
        onClick={close}
      />
      <ProjectDetails onClose={close} />
    </div>,
    document.body
  )
}

    </section>
  );
};

export default Projects;
