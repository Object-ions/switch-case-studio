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
      gsap.set(tracks, { xPercent: 0 });

      // ONE owner for xPercent. This used to be two live tweens on the same
      // property (a scrubbed fromTo + the infinite drift); GSAP renders
      // tweens in creation order, so the drift silently overwrote the scrub
      // every frame and the "intro on scroll" never showed. The scroll
      // influence is now a plain number the drift's modifier adds in.
      let scrollShift = 0; // 0 → -50 as the section crosses the viewport
      ScrollTrigger.create({
        trigger: wrap.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollShift = -50 * self.progress;
        },
      });

      // Gentle infinite drift, nudged by scroll.
      tracks.forEach((el, idx) => {
        gsap.to(el, {
          xPercent: '-=100',
          repeat: -1,
          duration: 30,
          ease: 'none',
          delay: idx * 0.2,
          modifiers: {
            xPercent: (v) => gsap.utils.wrap(-100, 0, parseFloat(v) + scrollShift),
          },
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
