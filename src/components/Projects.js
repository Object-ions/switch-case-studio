import projectsData from '../data/projects.json';
import ProjectsTiles from './ProjectsTiles';
import TextPressure from './TextPressure';

import '../styles/components/projects.scss';

const Projects = () => {
  return (
    <section
      className="projects"
      id="projects"
      aria-labelledby="projects-heading"
    >
      {/* Visually decorative wordmark; the real heading for a11y/SEO
          is the sr-only h2 below. */}
      <div className="projects-header" aria-hidden="true">
        <div className="projects-header__word">
          <TextPressure
            text="Case"
            alpha={false}
            stroke={true}
            width
            weight
            italic
            textColor="#ffffff"
            strokeColor="#f0d7ff"
            minFontSize={60}
          />
        </div>
        <div className="projects-header__word">
          <TextPressure
            text="Studies"
            alpha={false}
            stroke={true}
            width
            weight
            italic
            textColor="#ffffff"
            strokeColor="#f0d7ff"
            minFontSize={60}
          />
        </div>
      </div>

      <h2 id="projects-heading" className="sr-only">
        Selected work
      </h2>

      <ProjectsTiles projects={projectsData} />
    </section>
  );
};

export default Projects;
