import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import useReducedMotion from '../../hooks/useReducedMotion';

// "build" leads: it's the brand verb (hero + OG copy say "built for paid
// traffic") AND the word baked into the static HTML — the SSG hero must read
// "We build landing pages…" before any JS runs. typed.js takes over the span
// post-hydration; reduced-motion keeps the static word.
const STRINGS = ['build', 'design', 'launch', 'ship', 'craft'];

const WelcomeTyped = () => {
  const targetRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !targetRef.current) return;

    const typed = new Typed(targetRef.current, {
      strings: STRINGS,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1400,
      loop: true,
      showCursor: false,
    });

    return () => typed.destroy();
  }, [reducedMotion]);

  return (
    <span className="typed-cursor">
      <span ref={targetRef} className="typed-container">
        {STRINGS[0]}
      </span>
      <span className="typed-blinker" aria-hidden="true">
        |
      </span>
    </span>
  );
};

export default WelcomeTyped;
