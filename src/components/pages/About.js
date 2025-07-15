import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Statue from '../Statue';
import AnimatedHeading from '../AnimatedHeading';
import AnimatedParagraph from '../AnimatedParagraph';
import FloatingSquares from '../FloatingSquares';
import CircleLogo from '../CircleLogo';
import '../../styles/components/about.scss';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div id="about">
      <div className="about-grid">
        <Statue />
        <FloatingSquares />
        <CircleLogo />
        <AnimatedHeading />
        <AnimatedParagraph />
      </div>
    </div>
  );
};

export default About;
