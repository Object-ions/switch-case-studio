import preview from '../../assets/gifs/2.gif';
import WelcomeTyped from '../WelcomeTyped';

import '../../styles/components/home.scss';

const Home = () => {
  return (
    <div id="home">
      <WelcomeTyped />
      <div className="hero">
        <h1>
          <strong>Adaptable Solutions</strong> <br />
          in a Digital Age
        </h1>
        <p>
          Discover innovation and expertise in software development tailored for
          dynamic needs.
          <br />
          At Switch Case, we harness the power of technology to deliver
          versatile, efficient solutions. Dive into a world where your digital
          challenges meet agile responses.
        </p>
        <div className="links">
          <a href="#services">[Explore Our Services]</a>
          <a href="#contact">[Get In Touch]</a>
        </div>
      </div>
      <div className="img" style={{ backgroundImage: `url(${preview})` }}></div>
    </div>
  );
};

export default Home;
