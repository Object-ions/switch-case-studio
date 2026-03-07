import { useRef, useEffect } from 'react';
import WelcomeTyped from './WelcomeTyped';
import Aurora from './Aurora';

import '../styles/components/hero.scss';

const Hero = () => {
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const subTimer = setTimeout(() => {
      subRef.current?.classList.add('visible');
    }, 1200);
    const ctaTimer = setTimeout(() => {
      ctaRef.current?.classList.add('visible');
    }, 1800);
    return () => {
      clearTimeout(subTimer);
      clearTimeout(ctaTimer);
    };
  }, []);

  return (
    <div id="hero">
      <div className="hero-inner">
        <div className="aurora-bg">
          <Aurora
            colorStops={['#ff834a', '#f0d7ff', '#d99cff']}
            amplitude={0.3}
            blend={1}
            speed={2.0}
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-headline">
            <span className="hero-line">
              {'We '}
              <WelcomeTyped />
            </span>
            <span className="hero-line">Digital Experiences</span>
          </h1>

          <p className="hero-sub" ref={subRef}>
            Design, development &amp; marketing that moves the needle.
          </p>

          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            className="hero-cta"
            ref={ctaRef}
          >
            Book a Free Call
            <span className="cta-arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
