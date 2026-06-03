import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import useReducedMotion from '../../hooks/useReducedMotion';

const STRINGS = ['design', 'build', 'launch', 'ship', 'craft'];

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
      {reducedMotion ? (
        <span className="typed-container">{STRINGS[0]}</span>
      ) : (
        <span ref={targetRef} className="typed-container" />
      )}
      <span className="typed-blinker" aria-hidden="true">
        |
      </span>
    </span>
  );
};

export default WelcomeTyped;
