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
      className={`panel ${proj.panelClass} projects__tiles-item`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proj.id)}
      onKeyDown={onKey}
      aria-label={`Open ${proj.label} details`}
      {...(proj.panelClass === 'panel-card-3'
        ? { 'data-cursor-color': '#fff' }
        : {})}
    >
      {/* We render both labels once and let CSS swap on hover/focus */}
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
  <>
    {projects.map((p) => (
      <Tile key={p.id} proj={p} onOpen={onOpen} />
    ))}
  </>
);

export default ProjectsTiles;
