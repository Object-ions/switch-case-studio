import { Link } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import CaseStudyTiles from './CaseStudyTiles';
import TextPressure from '../ui/TextPressure';

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
