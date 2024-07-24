import work from '../../data/work.json';

const Work = () => {
  return (
    <div className="work">
      {work.map((item) => (
        <div className="work-item" key={item.id}>
          <div className="work-content">
            <div className="image-wrapper">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="details">
              <h3>{item.name}</h3>
              <p>
                Service: <br /> {item.service}
              </p>
              <p>
                Type: <br /> {item.type}
              </p>
              <p>{item.description}</p>
              <a href={item.link} className="button">
                Visit
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Work;
