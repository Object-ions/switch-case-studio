import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BookCallCta from '../ui/BookCallCta';
import useReducedMotion from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 * Mid-page booking moment (DESIGN_AUDIT P1-4).
 *
 * Was a ~13px bordered text link tucked into the right grid column —
 * the weakest treatment at the highest-intent spot (right after the
 * About narrative). Now a centered lead + the cream pill treatment,
 * mirroring the proven "Ready to be next?" beat in Reviews.
 *
 * Reveal follows the house safe-reveal rules (CLAUDE.md): hidden via
 * gsap.set (never fromTo/immediateRender), revealed play-once by an
 * onEnter trigger, timed safety net so the CTA can NEVER stay
 * invisible, reduced-motion skips straight to visible, and the whole
 * context reverts (ScrollTrigger killed) on unmount.
 * ------------------------------------------------------------------ */
const AboutCTA = () => {
  const ctaRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return undefined;

    if (reducedMotion) {
      gsap.set(el, { clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y: 40 });

      const reveal = () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          overwrite: 'auto',
        });

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: reveal,
      });

      // Already past the trigger at mount (deep-link / restored scroll):
      // a `once` trigger won't fire onEnter — reveal immediately.
      if (st.progress > 0) reveal();

      // Safety net: whatever happens, the conversion moment ends visible.
      gsap.delayedCall(3, () => gsap.set(el, { autoAlpha: 1, y: 0 }));
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="work-cta" ref={ctaRef}>
      <div className="work-cta__inner">
        <p className="work-cta__lead">Let&apos;s bring your idea to life.</p>
        <BookCallCta className="work-cta__button">
          <span className="cta-arrow" aria-hidden="true">
            &rarr;
          </span>
        </BookCallCta>
      </div>
    </div>
  );
};

export default AboutCTA;
