import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import '../../styles/components/marquee.scss';

const AboutMarquee = () => {
  const wrap = useRef(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray('.marquee-track');
      // Intro scrub on scroll
      gsap.fromTo(
        tracks,
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
      // Gentle infinite drift
      tracks.forEach((el, idx) => {
        gsap.to(el, {
          xPercent: '-=100',
          repeat: -1,
          duration: 30,
          ease: 'none',
          modifiers: {
            xPercent: gsap.utils.wrap(-100, 0),
          },
          delay: idx * 0.2,
        });
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="projects-row row-header" ref={wrap}>
      <div className="panel panel-header">
        {/* h2, not h1 — the home page's single h1 is the hero headline. */}
        {/* M9: brand-mark copy only. The old track restated the AboutHeading
            claim ("websites/AI that convert") word-for-word one viewport
            apart; the heading owns the claim, the marquee owns the mark. */}
        <h2 className="marquee" aria-label="Switch Case Studio">
          <span className="marquee-track">
            Switch Case Studio · design · code · <span className="caps-trim">AI</span> · Portland, Oregon · Switch Case Studio · built from scratch
          </span>
          <span className="marquee-track">
            Switch Case Studio · design · code · <span className="caps-trim">AI</span> · Portland, Oregon · Switch Case Studio · built from scratch
          </span>
        </h2>
      </div>
    </div>
  );
};

export default AboutMarquee;
