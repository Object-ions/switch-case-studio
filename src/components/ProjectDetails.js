import Arrow from "./Arrow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faArrowLeft } from '@fortawesome/free-solid-svg-icons'


import projectsData from "../data/projects.json";
import "../styles/components/projectDetails.scss";

const ProjectDetails = ({ onClose }) => {
  const data = projectsData[0];

  return (
    <section className="project-details" aria-label="Project details">
      {/* LEFT: image/media */}
      <div className="project-details__media" aria-label="Project preview">
        <img
          src={data.imageSrc}
          alt={data.imageAlt}
          className="project-details__img"
        />
        <Arrow />
      </div>

      {/* RIGHT: panel with header + scrollable content */}
      <div className="project-details__panel">
        <header className="project-details__header">
          <button
            className="project-details__back"
            type="button"
            onClick={onClose}
          >
              <FontAwesomeIcon icon={faArrowLeft} />
             {' '}Back to Projects
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

        <div className="project-details__scroll">
          <main className="project-details__main">
            <h1 className="project-details__title">{data.title}</h1>
            <p className="project-details__subtitle">{data.subtitle}</p>
            <p className="project-details__desc">{data.description}</p>

            {/* Tag list (existing) */}
            <nav className="project-details__socials" aria-label="Services">
              {data.services.map((s) => (
                <p key={s.label} className="project-details__social">
                  {s.label}
                </p>
              ))}
            </nav>

          <hr className="__divider"/>
          {/* CTA block (kept, with spacing tuned to match modal) */}
          <section
            className="project-details__cta"
            aria-label="Coaching product highlight"
          >
            <div>
            <p className="project-details__kicker">In dept on</p>
            <h2 className="project-details__product">Our Work</h2>
            </div>
            <a 
              href={data.ctaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-details__button"
            >
              View Live{' '}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </section>
            {/*Scope & Results */}
            <section
              className="project-details__scope"
              aria-label="Scope & Results"
            >
              <h2 className="project-details__scopeHeading">Scope & Results</h2>

              <ul className="project-details__scopeList">
                {data.highlights?.map((item) => (
                  <li key={item.title} className="project-details__scopeItem">
                    <h3 className="project-details__scopeTitle">{item.title}</h3>
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
          </main>

          <div className="project-details__divider" role="separator" />
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
