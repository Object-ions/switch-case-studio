import Arrow from '../Arrow';
import '../../styles/components/home.scss';
import HeroAnimation from '../HeroAnimation';


const Home = () => {
  return (
    <div id="home" >
      <div className="hero">
        <HeroAnimation />
        <Arrow />
      </div>
    </div>
  );
};

export default Home;
