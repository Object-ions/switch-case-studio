import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';
import {
  DUR_MED,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from '../animation/motionTokens';

/**
 * House safe-reveal for standalone-page headers (kicker / h1 / lede).
 * LC-26: motion/react's initial="hidden" serialized opacity:0 into the SSG
 * HTML — the page h1s were invisible without JS. This is the PricingGuide
 * (VE-8) pattern extracted: static HTML always ships visible; gsap.set
 * hides at runtime only; play-once onEnter + already-in-view fallback +
 * delayedCall safety net; reduced motion never hides at all. GSAP is the
 * sole owner of autoAlpha/y on the targets — no CSS transitions may exist
 * on the selector'd elements (verified per adopting route in the batch-2
 * recon before each page consumes this).
 */
const usePageHeaderReveal = (rootRef, selector = '.page-head-animate') => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const items = gsap.utils.toArray(selector, root);
    if (!items.length) return undefined;

    if (reduced) {
      gsap.set(items, { clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: REVEAL_Y });

      const reveal = () => {
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_MED,
          stagger: REVEAL_STAGGER,
          ease: EASE_OUT_SOFT,
          overwrite: 'auto',
        });
      };

      // No manual already-in-view fallback: ScrollTrigger evaluates position
      // on creation and fires onEnter itself when start is already passed —
      // a manual call would double-fire reveal() on the common top-of-route
      // path (verified by instrumented count on a cold /about load).
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: reveal,
      });

      // Safety net: only if nothing is running AND something is still hidden
      // (an in-flight reveal satisfies opacity<1 — don't restart it).
      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (
          !items.some((el) => gsap.isTweening(el)) &&
          items.some((el) => gsap.getProperty(el, 'opacity') < 1)
        ) {
          reveal();
        }
      });

      return () => {
        trigger.kill();
        safety.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [rootRef, selector, reduced]);
};

export default usePageHeaderReveal;
