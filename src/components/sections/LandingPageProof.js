import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { HashLink } from 'react-router-hash-link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';

import '../../styles/components/landingPageProof.scss';


const FEATURES = [
  {
    label: 'Landing pages',
    desc: 'One message. One CTA. Optimized for paid campaigns and built to convert.',
  },
  {
    label: 'E-commerce',
    desc: 'Product-first stores that sell — not just display. Designed for the full buyer journey.',
  },
  {
    label: 'Marketing sites',
    desc: 'Full-brand web presence built from scratch. Not a template, not a theme.',
  },
  {
    label: 'Agency-ready',
    desc: 'White-label and wholesale delivery available. Built to your brief, shipped on time.',
  },
];

const LandingPageProof = () => {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
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
      id="what-we-build"
      className="lpp"
      aria-label="What we build"
    >
      <div className="lpp__inner">
        <div className="lpp__header">
          <p className="lpp__kicker lpp-animate">What we build best</p>
          <h2 className="lpp__heading lpp-animate">
            Built to perform.<br />Whatever the format.
          </h2>
          <p className="lpp__body lpp-animate">
            E-commerce store, marketing site, or campaign page — every build
            starts with the same question: what needs to happen for a visitor
            to become a customer? We design and build with that answer in
            mind, delivered fast and built to last.
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
          See our work
          <span className="lpp__cta-arrow" aria-hidden="true">&rarr;</span>
        </HashLink>
      </div>
    </section>
  );
};

export default LandingPageProof;
