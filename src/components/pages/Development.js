import Star from '../../assets/images/star.png';
import gif1 from '../../assets/gifs/1.gif';
import gif2 from '../../assets/gifs/2.gif';
import gif3 from '../../assets/gifs/3.gif';
import gif4 from '../../assets/gifs/4.gif';
import packages from '../../data/development.json';

import '../../styles/components/development.scss';

const gifMap = {
  gif1: gif1,
  gif2: gif2,
  gif3: gif3,
  gif4: gif4,
};

const Development = () => {
  return (
    <div id="development">
      <div className="star">
        <img src={Star} alt="development" />
        <h1>Web Development</h1>
      </div>
      {packages.map((pkg, index) => (
        <div className="package" key={index}>
          <div className="package-image">
            <img src={gifMap[pkg.gif]} alt={pkg.title} />
          </div>
          <div className="package-title-price-desc">
            <p className="package-title">{pkg.title}</p>
            <p className="package-description">{pkg.description}</p>
            <p className="package-price">{pkg.price}</p>
          </div>
          <div className="package-main">
            <div className="package-includes">
              <ul>
                {pkg.includes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Development;
