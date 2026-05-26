import { useLayoutEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

import '../styles/components/landingPageProof.scss';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    label: 'Offer clarity',
    desc: 'One message. One action. No distractions.',
  },
  {
    label: 'Mobile-first',
    desc: 'Built for how paid traffic actually arrives.',
  },
  {
    label: 'Fast turnaround',
    desc: 'Most pages live in under two weeks.',
  },
  {
    label: 'Agency-ready',
    desc: 'White-label and wholesale delivery available.',
  },
];

const LandingPageProof = () => {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.lpp-animate', sectionRef.current);

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="landing-pages"
      className="lpp"
      aria-label="Landing page specialty"
    >
      <div className="lpp__inner">
        <div className="lpp__header">
          <p className="lpp__kicker lpp-animate">What we build best</p>
          <h2 className="lpp__heading lpp-animate">
            Landing pages engineered<br />for paid traffic.
          </h2>
          <p className="lpp__body lpp-animate">
            Google Ads. Meta. Email. Retargeting. If you're spending money to
            send traffic somewhere, that page has one job: convert. We design
            and build high-performance landing pages with a clear offer, a
            single conversion path, and the kind of trust-building detail that
            keeps Quality Scores high and bounce rates low.
          </p>
        </div>

        <div className="lpp__features" role="list">
          {FEATURES.map((f) => (
            <div key={f.label} className="lpp__feature lpp-animate" role="listitem">
              <strong className="lpp__feature-label">{f.label}</strong>
              <span className="lpp__feature-desc">{f.desc}</span>
            </div>
          ))}
        </div>

        <HashLink
          to="/#projects"
          smooth
          className="lpp__cta lpp-animate"
        >
          See landing page work
          <span className="lpp__cta-arrow" aria-hidden="true">&rarr;</span>
        </HashLink>
      </div>
    </section>
  );
};

export default LandingPageProof;
