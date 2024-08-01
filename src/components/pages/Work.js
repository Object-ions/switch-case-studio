import work from '../../data/work.json';
import '../../styles/components/work.scss';

const Work = () => {
  return (
    <div className="work">
      {work.map((item) => (
        <div className="work-item" key={item.id}>
          <div className="work-content">
            <div className="image-wrapper">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="link">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="button"
              >
                Visit
              </a>
            </div>

            <div className="details">
              <h3>{item.name.toUpperCase()}</h3>
              <p>
                Service: <br /> {item.service}
              </p>
              <p>
                Type: <br /> {item.type}
              </p>
              <p>
                What is {item.name}: <br /> {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Work;
