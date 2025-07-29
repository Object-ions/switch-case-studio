import { useEffect, useRef } from 'react';
import { ReactComponent as CircleSVG } from '../assets/images/circle-logo.svg';
import gsap from 'gsap';
import '../styles/components/circleLogo.scss';

const CircleLogo = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    const el = logoRef.current;

    gsap.set(el, { scale: 0.6, opacity: 0 });

    gsap.to(el, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });

    gsap.to(el, {
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
