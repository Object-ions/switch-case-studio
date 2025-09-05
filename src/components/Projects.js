import "../styles/components/projects.scss";

const Projects = () => {
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
      <div className="panel panel-hero">
        <span className="panel-label">Zahav Medspa</span>
      </div>

      <div className="panel panel-card-1">
        <span className="panel-label">ProDani Miami</span>
      </div>

      <div className="panel panel-card-2">
        <span className="panel-label">PROJECT B</span>
      </div>

      <div className="panel panel-card-3">
        <span className="panel-label">PROJECT C</span>
      </div>

      {/* Row 2: 2fr, 1fr, 1fr  (first spans two columns) */}
      <div className="panel panel-about">
        <h3>ABOUT THIS WORK</h3>
        <p>
          Brief context for the selected projects—scope, role, stack, and
          outcomes. Replace this copy or inject project summaries into each tile.
        </p>
      </div>

      <div className="panel panel-tagline">
        <span>WEB · BRAND · INTERACTIVE</span>
      </div>

      <div className="panel panel-link">
        <span>VIEW ALL</span>
      </div>
    </section>
  );
};

export default Projects;
