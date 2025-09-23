import WelcomeTyped from "../WelcomeTyped";
import HeroVideo from "../../assets/videos/new_hero_video_SCS.mp4";

import "../../styles/components/home.scss";
const Home = () => {
  return (
    <div id="home">
      <div className="hero">
        <video className="background-video" autoPlay muted loop playsInline>
          <source src={HeroVideo} type="video/mp4" />
        </video>

        <div className="left">
          We <br />
          <WelcomeTyped />
          Digital <br />
          Experiences
        </div>
      </div>
    </div>
  );
};

export default Home;
