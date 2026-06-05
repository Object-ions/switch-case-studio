import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import AboutHeading from './AboutHeading';
import AboutText from './AboutText';
import AboutCTA from './AboutCTA';
import AboutMarquee from './AboutMarquee';

import Squares from '../ui/Squares';
import '../../styles/components/work.scss';

// The Three.js stack (three + fiber + drei + Draco ≈ 990KB chunk) must not
// touch the initial load. React.lazy alone is NOT enough: rendering <Moon/>
// at hydration fires the import immediately — PSI showed the chunk fetching+
// parsing during the hero's LCP window with no scroll. The import itself is
// gated behind an IntersectionObserver: nothing downloads until the moon's
// slot scrolls within ~200px of the viewport.
const Moon = lazy(() => import('../ui/Moon'));

const MoonSlot = () => {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true); // ancient browser: load it, same as before
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // SSR + first client render are both `near = false` (empty slot, same
  // dimensions) — no hydration divergence; the moon mounts on approach.
  return (
    <div ref={ref} className="work-moon">
      {near && (
        <Suspense fallback={null}>
          <Moon />
        </Suspense>
      )}
    </div>
  );
};

const About = () => {
  return (
    <div id="about">
      {/* Animated grid background */}
      <div className="squares-bg">
        <Squares
          speed={0.1}
          squareSize={50}
          direction="down"
          borderColor="#7f7f7f"
          hoverFillColor="#dab8ff"
        />
      </div>

      <div className="work-wrapper">
        <AboutHeading />
        <AboutMarquee />

        <div className="work-content">
          <AboutText />
          <MoonSlot />
        </div>

        <AboutCTA />
      </div>
    </div>
  );
};

export default About;
