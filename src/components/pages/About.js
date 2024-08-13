import '../../styles/components/about.scss';
import img from '../../assets/images/IMG_2987black.png';

const About = () => {
  return (
    <div id="about">
      <div className="about-content">
        <div class="blue-square"></div>

        <div className="about-text">
          <h2>About Switch Case</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta
            itaque minima quidem odit accusamus ratione, molestias corporis
            repellat accusantium vel!
          </p>
        </div>
        <div className="image-wrapper">
          <img src={img} alt="switch case" />
        </div>
      </div>
    </div>
  );
};

export default About;
