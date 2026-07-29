import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import '../../styles/components/cursorComponent.scss';

const PURPLE = '#d99cff'; // $g6

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input[type='button'], input[type='submit'], summary, [data-cursor-color], [data-cursor-morph]";

// Zones where wrapping looks wrong (logo art, accordion rows): the cursor
// falls back to the classic hollow 35px square there instead of morphing.
const NO_MORPH_ZONES = '.site-header, .faq';
const HOVER_SIZE = 35;

const BASE = 25; // resting square
const PRESSED = 17; // VE-12 press tighten
const MORPH_PAD = 10; // breathing room around a wrapped element

const CursorComponent = () => {
  const dotRef = useRef(null);

  // Pointer detection lives in an effect, not at module scope: the SSG render
  // has no window (server output = null, same as the first client render —
  // no hydration divergence), and the portal target (document.body) must not
  // be touched until we're mounted in a real browser.
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    setIsPointerDevice(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    );
  }, []);

  useEffect(() => {
    if (!isPointerDevice) return;

    // Native cursor off everywhere while the custom square exists (class-
    // gated so touch / non-mounting environments keep the OS cursor).
    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    let parked = true; // VE-12: hidden until the first real mousemove
    let morphTarget = null; // element the cursor is currently wrapped around
    let pressed = false;
    let lastX = 0;
    let lastY = 0;
    let xTo, yTo, wTo, hTo;

    // JS owns ALL cursor geometry (position + size). CSS transitions on
    // width/height were removed from the stylesheet: they'd re-animate every
    // per-frame quickTo write and turn the morph to mush.
    const makeSetters = () => {
      xTo = gsap.quickTo(dot, 'x', { duration: 0.16, ease: 'power2.out' });
      yTo = gsap.quickTo(dot, 'y', { duration: 0.16, ease: 'power2.out' });
      wTo = gsap.quickTo(dot, 'width', { duration: 0.28, ease: 'power3.out' });
      hTo = gsap.quickTo(dot, 'height', { duration: 0.28, ease: 'power3.out' });
    };

    // While wrapped, stay glued to the element every frame — survives
    // scrolling, magnetic-button drift, and hover-lift transforms.
    const morphTick = () => {
      if (!morphTarget) return;
      const r = morphTarget.getBoundingClientRect();
      xTo(r.left + r.width / 2);
      yTo(r.top + r.height / 2);
      wTo(r.width + MORPH_PAD);
      hTo(r.height + MORPH_PAD);
    };

    const onMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (parked) {
        // First move: snap into place (no tween from 0,0) and claim the
        // -50% centering in GSAP terms — the CSS translate parses into a
        // pixel matrix that the x/y tweens would otherwise discard,
        // leaving the dot anchored by its corner.
        parked = false;
        gsap.set(dot, {
          x: e.clientX,
          y: e.clientY,
          xPercent: -50,
          yPercent: -50,
          width: BASE,
          height: BASE,
        });
        makeSetters();
        dot.classList.remove('is-parked');
        return;
      }
      if (morphTarget) return; // wrapped: morphTick owns position
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // VE-12: physical press feedback — the dot tightens while the button is
    // down (skipped while wrapped around an element; the wrap IS the state).
    const onDown = () => {
      pressed = true;
      if (!morphTarget && wTo) {
        wTo(PRESSED);
        hTo(PRESSED);
      }
    };
    const onUp = () => {
      pressed = false;
      if (!morphTarget && wTo) {
        wTo(BASE);
        hTo(BASE);
      }
    };

    const onOver = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target || parked) return;

      const custom = target.getAttribute('data-cursor-color');
      if (custom) {
        dot.style.setProperty('--cursor-color', custom);
      } else if (target.closest('.site-header, .faq, #testimonials, #hero')) {
        dot.style.setProperty('--cursor-color', PURPLE);
      } else {
        dot.style.removeProperty('--cursor-color');
      }

      // No-morph zones: classic hollow square, no wrapping.
      if (target.closest(NO_MORPH_ZONES)) {
        if (morphTarget) {
          morphTarget = null;
          gsap.ticker.remove(morphTick);
          gsap.to(dot, { borderRadius: 0, duration: 0.2, ease: 'power2.out' });
        }
        if (wTo) {
          wTo(HOVER_SIZE);
          hTo(HOVER_SIZE);
        }
        dot.classList.add('is-hovering');
        dot.classList.remove('is-morphed');
        return;
      }

      // Become the element's border: wrap the hovered element, matching its
      // rounded corners (square elements get a hair of rounding so the
      // cursor never looks broken against them).
      if (morphTarget !== target) {
        morphTarget = target;
        const radius = getComputedStyle(target).borderRadius;
        gsap.to(dot, {
          borderRadius: radius === '0px' ? '3px' : radius,
          duration: 0.25,
          ease: 'power2.out',
        });
        gsap.ticker.add(morphTick);
      }

      dot.classList.add('is-hovering', 'is-morphed');
    };

    const onOut = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;
      // Still inside the wrapped element (moved onto a child)? Not a real exit.
      if (e.relatedTarget && target.contains(e.relatedTarget)) return;

      dot.classList.remove('is-hovering', 'is-morphed');
      dot.style.removeProperty('--cursor-color');

      if (morphTarget) {
        morphTarget = null;
        gsap.ticker.remove(morphTick);
        gsap.to(dot, { borderRadius: 0, duration: 0.2, ease: 'power2.out' });
        if (wTo) {
          const size = pressed ? PRESSED : BASE;
          wTo(size);
          hTo(size);
          xTo(lastX);
          yTo(lastY);
        }
      } else if (wTo) {
        // leaving a no-morph hover: shrink the hollow square back down
        const size = pressed ? PRESSED : BASE;
        wTo(size);
        hTo(size);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('mouseup', onUp, true);
    window.addEventListener('blur', onUp);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      gsap.ticker.remove(morphTick);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('pointerover', onOver, true);
      document.removeEventListener('pointerout', onOut, true);
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('mouseup', onUp, true);
      window.removeEventListener('blur', onUp);
    };
  }, [isPointerDevice]);

  if (!isPointerDevice) return null;

  return createPortal(
    <div id="cursor-dot" className="is-parked" ref={dotRef} />,
    document.body,
  );
};

export default CursorComponent;
