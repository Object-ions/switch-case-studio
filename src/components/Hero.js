import { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import WelcomeTyped from './WelcomeTyped';
import Aurora from './Aurora';
import useReducedMotion from '../hooks/useReducedMotion';

import '../styles/components/hero.scss';

const Hero = () => {
  const reducedMotion = useReducedMotion();
  // `revealed` controls staggered fade-in for sub + CTAs.
  // Reduced-motion users skip the stagger and see everything immediately.
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  return (
    <section id="hero" aria-label="Switch Case Studio introduction">
      <div className="hero-inner">
        {!reducedMotion && (
          <div className="aurora-bg" aria-hidden="true">
            <Aurora
              colorStops={['#ff834a', '#f0d7ff', '#d99cff']}
              amplitude={0.3}
              blend={1}
              speed={2.0}
            />
          </div>
        )}

        <div className="hero-content">
          <h1 className="hero-headline">
            <span className="hero-line">
              {'We '}
              <WelcomeTyped />
            </span>
            <span className="hero-line">digital experiences</span>
            <span className="hero-line hero-line--accent">
              that move the needle.
            </span>
          </h1>

          <p className={`hero-sub ${revealed ? 'is-visible' : ''}`}>
            Design, development &amp; marketing &mdash; custom-built for
            ambitious brands.
          </p>

          <div className={`hero-ctas ${revealed ? 'is-visible' : ''}`}>
            <a
              href="https://calendar.app.google/83UCJjis2FHUrr1s6"
              className="hero-cta hero-cta--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Free Call
              <span className="cta-arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>

            <HashLink
              to="/#projects"
              smooth
              className="hero-cta hero-cta--secondary"
            >
              See Our Work
              <span className="cta-arrow" aria-hidden="true">
                &darr;
              </span>
            </HashLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
