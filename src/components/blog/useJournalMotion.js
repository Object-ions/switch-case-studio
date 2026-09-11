import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import armSafetyNet from '../../animation/armSafetyNet';
import {
  DUR_MED,
  DUR_SLOW,
  EASE_OUT,
  REVEAL_STAGGER,
  REVEAL_Y,
} from '../../animation/motionTokens';

gsap.registerPlugin(ScrollTrigger);

/* Journal motion (2026-09-11). House rules apply: static HTML ships visible,
   GSAP only hides at runtime and only what is below the fold, every reveal
   has a viewport-aware safety net, and reduced motion gets none of it.
   - body sections and the footer rise in as they are scrolled to;
   - a lavender reading-progress bar scrubs with the article;
   - the cover image drifts inside its frame (scrub) and leans toward the
     pointer on hover-capable devices;
   - opening another post re-runs the head entrance; changing list page
     staggers the new rows in. Neither runs on the first load. */
export default function useJournalMotion(rootRef, slug, page) {
  const reduced = useReducedMotion();
  const seenSlug = useRef(slug);
  const seenPage = useRef(page);

  // Scroll reveals, progress bar, cover drift + pointer lean.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    const disarms = [];
    const ctx = gsap.context(() => {
      root.querySelectorAll('.journal__section, .journal__foot').forEach((sec) => {
        if (ScrollTrigger.isInViewport(sec, 0.05)) return; // first screen stands
        const items = [...sec.children].flatMap((c) =>
          c.classList.contains('journal__cols') ? [...c.children] : [c],
        );
        let done = false;
        gsap.set(items, { autoAlpha: 0, y: REVEAL_Y });
        const reveal = () => {
          if (done) return;
          done = true;
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: DUR_SLOW,
            ease: EASE_OUT,
            stagger: REVEAL_STAGGER,
          });
        };
        ScrollTrigger.create({ trigger: sec, start: 'top 88%', once: true, onEnter: reveal });
        disarms.push(
          armSafetyNet(sec, () => done || gsap.isTweening(items[0]), () => {
            done = true;
            gsap.set(items, { autoAlpha: 1, y: 0 });
          }),
        );
      });

      const bar = root.querySelector('.journal__progress');
      const article = root.querySelector('.journal__article');
      if (bar && article) {
        gsap.set(bar, { x: 0, scaleX: 0, transformOrigin: '0 50%' });
        gsap.to(bar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: article, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        });
      }

      const cover = root.querySelector('.journal__cover');
      const art = cover?.firstElementChild;
      if (cover && art) {
        gsap.set(art, { x: 0, y: 0, xPercent: 0, yPercent: -3, scale: 1.08 });
        gsap.to(art, {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          const toX = gsap.quickTo(art, 'x', { duration: 0.6, ease: EASE_OUT });
          const lean = (e) => {
            const r = cover.getBoundingClientRect();
            toX(((e.clientX - r.left) / r.width - 0.5) * 24);
          };
          const rest = () => toX(0);
          cover.addEventListener('pointermove', lean, { passive: true });
          cover.addEventListener('pointerleave', rest, { passive: true });
          return () => {
            cover.removeEventListener('pointermove', lean);
            cover.removeEventListener('pointerleave', rest);
          };
        }
      }
      return undefined;
    }, root);
    return () => {
      disarms.forEach((d) => d());
      ctx.revert();
    };
  }, [rootRef, slug, reduced]);

  // Opening another post: the cover wipes down (clip-path), then the title
  // and lede un-blur into place. Reduced motion keeps a short fade only.
  useEffect(() => {
    if (seenSlug.current === slug) return;
    seenSlug.current = slug;
    const root = rootRef.current;
    if (!root) return;
    const cover = root.querySelector('.journal__cover');
    const head = root.querySelectorAll('.journal__head > *');
    const all = [cover, ...head].filter(Boolean);
    if (reduced) {
      gsap.fromTo(all, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none', immediateRender: true, clearProps: 'opacity,visibility' });
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => gsap.set(all, { clearProps: 'opacity,visibility,transform,filter,clipPath' }),
    });
    if (cover) {
      gsap.set(cover, { clipPath: 'inset(0% 0% 100% 0%)' });
      tl.to(cover, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.inOut' });
    }
    gsap.set(head, { autoAlpha: 0, y: 12, filter: 'blur(4px)' });
    tl.to(head, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: DUR_MED, ease: EASE_OUT, stagger: 0.06 }, cover ? 0.25 : 0);
  }, [rootRef, slug, reduced]);

  // Changing list page: the new rows stagger in.
  useEffect(() => {
    if (seenPage.current === page) return;
    seenPage.current = page;
    const root = rootRef.current;
    if (!root || reduced) return;
    const rows = root.querySelectorAll('.journal__list li:not([aria-hidden])');
    gsap.set(rows, { autoAlpha: 0, x: -12 });
    gsap.to(rows, {
      autoAlpha: 1,
      x: 0,
      duration: DUR_MED,
      ease: EASE_OUT,
      stagger: 0.035,
      onComplete: () => gsap.set(rows, { clearProps: 'opacity,visibility,transform' }),
    });
  }, [rootRef, page, reduced]);
}
