import work from '../../data/work.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as TrianglesIcon } from '../../assets/images/triangles.svg';

import '../../styles/components/work.scss';

const Work = () => {
  return (
    <div id="work">
      <div className="work-meta">
        <div className="work-text">
          <h1>
            <TrianglesIcon style={{ width: '170px' }} />
            Innovating the means of production<span>...</span>
          </h1>
          <p>
            We have developed a robust set of processes that ensure all
            solutions are implemented appropriately for us to push culture
            forward in a timely manner that achieves both the quality we aspire
            to, and the quality you deserve.
          </p>
        </div>

        {work.map((item) => (
          <div className="work-item" key={item.id}>
            <div className="work-content">
              <div
                className="image-wrapper"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>

              <div className="details">
                <h3>{item.name} </h3>
                <p>{item.service}</p>
                <p>{item.type}</p>
                <p>{item.description}</p>

                <a href={item.link} target="_blank" rel="noreferrer">
                  View Project{' '}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
