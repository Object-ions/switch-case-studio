import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Tile = ({ proj, onOpen }) => {
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(proj.id);
    }
  };
  return (
    <div
      className={`panel ${proj.panelClass}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proj.id)}
      onKeyDown={onKey}
      aria-label={`Open ${proj.label} details`}
    >
      <span className="panel-label" data-about={`About ${proj.label}`}>
        {proj.label}
      </span>
      {proj.tileVersion && (
        <p className="panel-excerpt">
          {proj.tileVersion}
          <br />
          <b>Click to View</b> <FontAwesomeIcon icon={faArrowRight} />
        </p>
      )}
    </div>
  );
};

const ProjectsTiles = ({ projects, onOpen }) => (
  <div className="projects-row row-tiles">
    {projects.map((p) => (
      <Tile key={p.id} proj={p} onOpen={onOpen} />
    ))}
  </div>
);

export default ProjectsTiles;
