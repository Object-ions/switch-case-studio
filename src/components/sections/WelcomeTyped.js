import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import useReducedMotion from '../../hooks/useReducedMotion';

// "build" leads: it's the brand verb (hero + OG copy say "built for paid
// traffic") AND the word baked into the static HTML — the SSG hero must read
// "We build landing pages…" before any JS runs. typed.js takes over the span
// post-hydration; reduced-motion keeps the static word.
const STRINGS = ['build', 'design', 'launch', 'ship', 'craft'];

// Fixed-width slot for the cycling word — words of different widths reflowed
// the headline every cycle (desktop CLS 0.177 once SSG painted it early
// enough to be measured). The hero face is SCS Display via `font: inherit`
// (NOT monospace — an earlier version of this comment claimed Roboto Mono,
// which is loaded nowhere). `ch` = the width of "0" in that face; 6ch
// comfortably covers the longest word ("design"/"launch") — verified
// pixel-stable across full type/backspace cycles. Inline style so the slot
// can never drift from STRINGS.
const slotCh = Math.max(...STRINGS.map((s) => s.length));
const SLOT_STYLE = {
  display: 'inline-block',
  minWidth: `${slotCh}ch`,
  textAlign: 'left',
};

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
      {/* One span serves both roles: SSR/static word AND typed.js target —
          the slot width applies identically before and after hydration, so
          the takeover can't shift anything. */}
      <span ref={targetRef} className="typed-container" style={SLOT_STYLE}>
        {STRINGS[0]}
      </span>
      <span className="typed-blinker" aria-hidden="true">
        |
      </span>
    </span>
  );
};

export default WelcomeTyped;
