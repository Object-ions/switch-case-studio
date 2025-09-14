import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const ProjectsInfoRow = () => (
  <div className="projects-row row-info">
    <div className="panel panel-about">
      <h3>WHAT’S BEHIND THE TILE?</h3>
      <p>Hover to Explore</p>
      <p>
        Move over a project to reveal its story. <b>Click to dive deeper</b> in
        a popup view.
      </p>
    </div>

    <div className="panel panel-tagline">
      <span>WEB · BRAND · INTERACTIVE</span>
    </div>

    <div className="panel panel-link">
      <a
        href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
        target="_blank"
        rel="noreferrer"
        style={{ fontWeight: 600 }}
      >
        Book a Free Call{' '}
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          style={{ fontSize: 12 }}
        />
      </a>
    </div>
  </div>
);

export default ProjectsInfoRow;
