import WelcomeTyped from '../WelcomeTyped';
import Arrow from '../Arrow';
import heroBg from '../../assets/images/DP822195.png';
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
