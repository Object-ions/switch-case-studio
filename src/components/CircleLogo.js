import { useEffect, useRef } from 'react';
import { ReactComponent as CircleSVG } from '../assets/images/circle-logo.svg';
import gsap from 'gsap';
import '../styles/components/circleLogo.scss';

const CircleLogo = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.to(logoRef.current, {
      rotate: 360,
      duration: 30,
      repeat: -1,
      ease: 'linear',
      transformOrigin: 'center center',
    });
  }, []);

  return (
    <div className="circle-logo-wrapper" ref={logoRef}>
      <CircleSVG className="circle-svg" />
    </div>
  );
};

export default CircleLogo;
