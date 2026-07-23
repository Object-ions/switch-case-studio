import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';
import { LANDING_PATHNAME } from '../utils/landingPath';
import {
  DUR_MED,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from '../animation/motionTokens';

/**
 * House safe-reveal for standalone-page headers (kicker / h1 / lede).
 * LC-26a-rev: the entrance runs ONLY on client-side navigation. On SSG
 * first load the static header is already visible and correct — hiding it
 * at hydration re-opened a flash window that scales with route-chunk
 * weight (measured ~1.6–1.9s cold on /about). First load now does NOTHING:
 * no hide, no trigger, no inline styles. Client navs get the full
 * PricingGuide-pattern reveal (hide → onEnter → isTweening-guarded net),
 * where no static HTML exists to preserve and the entrance is additive.
 * Detection lives entirely in effects — render output never branches, so
 * hydration cannot mismatch.
 *
 * The landing URL comes from ../utils/landingPath, which src/index.js
 * imports so it is captured at ENTRY-chunk evaluation. Capturing it here
 * would break: this file bundles into the lazy route chunk, which
 * evaluates DURING the first client navigation — after the pathname has
 * already changed (LC-26a-rev latch-placement flaw, owner-caught).
 */
let hasClientNavigated = false; // a consumer mounted at a non-landing path
let initialPathConsumed = false; // the landing route's first-load skip ran

const usePageHeaderReveal = (rootRef, selector = '.page-head-animate') => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    // First-load detection. Cases:
    // - land directly on a consumer route → skip (static header stands);
    // - land elsewhere, navigate here → path ≠ LANDING_PATHNAME → animate;
    // - land here, navigate away, come back → remount with
    //   initialPathConsumed already true → animate.
    // Hash-only changes never reach this (pathname ignores hash; a hash
    // scroll doesn't remount the page). Dev StrictMode's second effect
    // pass sees initialPathConsumed=true and animates — dev-only
    // divergence, accepted and documented.
    const atLandingPath = window.location.pathname === LANDING_PATHNAME;
    const isFirstLoad =
      atLandingPath && !hasClientNavigated && !initialPathConsumed;
    if (atLandingPath) initialPathConsumed = true;
    else hasClientNavigated = true;
    if (isFirstLoad) return undefined;

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

      // No manual already-in-view fallback: ScrollTrigger fires onEnter at
      // creation when start is already passed (instrumented, LC-26a).
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: reveal,
      });

      // Safety net: only if nothing is running AND something is hidden.
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
