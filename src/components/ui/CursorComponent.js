import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import '../../styles/components/cursorComponent.scss';

const PURPLE = '#d99cff'; // $g6

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input[type='button'], input[type='submit'], summary, label, [data-cursor-color]";

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

    const dot = dotRef.current;
    let parked = true; // VE-12: hidden until the first real mousemove

    const onMove = (e) => {
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
        });
        dot.classList.remove('is-parked');
        return;
      }
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    // VE-12: physical press feedback — the dot tightens while the button
    // is down (width/height only; GSAP owns the transform).
    const onDown = () => dot.classList.add('is-pressed');
    const onUp = () => dot.classList.remove('is-pressed');

    const onOver = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;

      const custom = target.getAttribute('data-cursor-color');
      if (custom) {
        dot.style.setProperty('--cursor-color', custom);
      } else if (target.closest('.site-header, .faq, #testimonials, #hero')) {
        dot.style.setProperty('--cursor-color', PURPLE);
      } else {
        dot.style.removeProperty('--cursor-color');
      }

      dot.classList.add('is-hovering');
    };

    const onOut = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;

      dot.classList.remove('is-hovering');
      dot.style.removeProperty('--cursor-color');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('mouseup', onUp, true);
    window.addEventListener('blur', onUp);

    return () => {
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
