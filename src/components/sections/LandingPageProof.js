import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';

import '../../styles/components/landingPageProof.scss';

const LandingPageProof = () => {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.lpp-animate', sectionRef.current);

      // House safe-reveal (DESIGN_AUDIT P1-7): the old fromTo+once carried
      // the immediateRender trap (a ScrollTrigger.refresh() during load
      // re-applies the hidden from-state — the CaseStudyTiles bug class),
      // and an already-past `once` trigger never fires onEnter. set →
      // onEnter → in-view fallback → safety net.
      gsap.set(targets, { autoAlpha: 0, y: 28 });

      const reveal = () =>
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: 'auto',
        });

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        once: true,
        onEnter: reveal,
      });
      if (st.progress > 0) reveal();

      gsap.delayedCall(3, () => gsap.set(targets, { autoAlpha: 1, y: 0 }));
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
      {/* M1 (mobile audit): the feature-card grid + "See our work" CTA are
          gone — the cards restated the service rows that follow immediately
          below, so on mobile the home read as the same "what we do" list
          twice. This header now IS the intro to the Services rows; the two
          components render as one section (seam spacing tuned in
          landingPageProof.scss / services.scss). */}
      <div className="lpp__inner">
        <div className="lpp__header">
          <h2 className="lpp__heading lpp-animate">
            One studio.<br />Design, code &amp; AI.
          </h2>
          <p className="lpp__body lpp-animate">
            Store, marketing site, web app, or the automation behind it,
            every build starts with the same question: what needs to happen
            for a visitor to become a customer? We design it, engineer it,
            and wire in AI where it moves that number. White-label delivery
            for agencies included.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingPageProof;
