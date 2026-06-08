import { Link } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import CaseStudyTiles from './CaseStudyTiles';

import '../../styles/components/projects.scss';

const featured = projectsData.filter((p) => p.featured);

const CaseStudies = () => {
  return (
    <section
      className="projects"
      id="projects"
      aria-labelledby="projects-heading"
    >
      <div className="projects-header" aria-hidden="true">
        <span className="projects-header__word">Case</span>
        <span className="projects-header__word">Studies</span>
      </div>

      <h2 id="projects-heading" className="sr-only">
        Selected work
      </h2>

      <CaseStudyTiles projects={featured} />

      <div className="projects-viewall">
        <Link to="/projects" className="projects-viewall__link">
          View all case studies
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </section>
  );
};

export default CaseStudies;
