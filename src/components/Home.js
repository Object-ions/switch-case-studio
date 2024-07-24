import { Link } from 'react-router-dom';
import preview from '../assets/images/prview.png';

const Home = () => {
  return (
    <div className="home">
      <p className="p-hello">Hello</p>
      <div className="hero">
        <h1>Adaptable Solutions in a Digital Age</h1>
        <p>
          Discover innovation and expertise in software development tailored for
          dynamic needs.
          <br />
          At Switch Case, we harness the power of technology to deliver
          versatile, efficient solutions. Dive into a world where your digital
          challenges meet agile responses.
        </p>
        <Link to="/">[Explore Our Services]</Link>
        <Link to="/">[Get In Touch]</Link>
      </div>
      <img className="img" src={preview} alt="hero" />
    </div>
  );
};

export default Home;
