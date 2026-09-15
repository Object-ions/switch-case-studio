import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import armSafetyNet from '../animation/armSafetyNet';

gsap.registerPlugin(ScrollTrigger);

/**
 * Typographic build reveal (Services.js `ServiceItem` pattern, generalized):
 * a hairline draws left → right, the title rises out of a mask, meta/body
 * fade + rise in behind it. One ScrollTrigger per item, once:true, a
 * viewport-aware safety net (armSafetyNet) so the item can never end up
 * stuck invisible. Static HTML ships visible; hidden state is set here at
 * runtime only, and reduced motion skips straight to it.
 *
 * `selectors` are queried from `itemRef.current` (not passed as refs), so
 * callers don't need to thread individual node refs down — same as
 * ServiceItem: { rule, title, meta, body } are CSS selectors, meta/body may
 * match multiple elements.
 */
export default function useBuildReveal(itemRef, selectors, { delay = 0 } = {}) {
  const { rule: ruleSel, title: titleSel, meta: metaSel, body: bodySel } = selectors;

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const rule = ruleSel ? el.querySelector(ruleSel) : null;
    const title = titleSel ? el.querySelector(titleSel) : null;
    const meta = metaSel ? gsap.utils.toArray(el.querySelectorAll(metaSel)) : [];
    const body = bodySel ? gsap.utils.toArray(el.querySelectorAll(bodySel)) : [];
    const pieces = [rule, title, ...meta, ...body].filter(Boolean);
    if (!pieces.length) return undefined;

    const ctx = gsap.context(() => {
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
      if (title) gsap.set(title, { yPercent: 110 });
      if (meta.length) gsap.set(meta, { autoAlpha: 0, y: 8 });
      if (body.length) gsap.set(body, { autoAlpha: 0, y: 16 });

      let played = false;
      const reveal = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline({ delay, defaults: { overwrite: 'auto' } });
        if (rule) tl.to(rule, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, 0);
        if (title) tl.to(title, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0.1);
        if (meta.length) tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.15);
        if (body.length) {
          tl.to(body, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, 0.3);
        }
      };

      const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: reveal });
      if (st.progress > 0) reveal();

      const disarm = armSafetyNet(
        el,
        () => played || pieces.some((p) => gsap.isTweening(p)),
        () => {
          played = true;
          if (rule) gsap.set(rule, { scaleX: 1 });
          if (title) gsap.set(title, { yPercent: 0 });
          if (meta.length || body.length) gsap.set([...meta, ...body], { autoAlpha: 1, y: 0 });
        },
      );
      return () => disarm();
    }, el);

    return () => ctx.revert();
  }, [itemRef, ruleSel, titleSel, metaSel, bodySel, delay]);
}
