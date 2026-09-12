import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import AboutHeading from './AboutHeading';
import AboutText from './AboutText';
import AboutCTA from './AboutCTA';
import AboutMarquee from './AboutMarquee';
import Polaroids from './Polaroids';

import DecorativeBoundary from '../util/DecorativeBoundary';
import '../../styles/components/work.scss';

// The Three.js stack (three + fiber + drei + Draco ≈ 990KB chunk) must not
// touch the initial load. React.lazy alone is NOT enough: rendering <Moon/>
// at hydration fires the import immediately — PSI showed the chunk fetching+
// parsing during the hero's LCP window with no scroll. The import itself is
// gated behind an IntersectionObserver: nothing downloads until the moon's
// slot scrolls within ~200px of the viewport.
// Since 2026-09-12 the slot holds DepthImage (a relit photo, three + fiber,
// no drei, no model); the gate and its reasoning are unchanged.
const DepthImage = lazy(() => import('../ui/DepthImage'));

// Can this browser create a WebGL context at all? If not, the 990KB Three.js
// chunk is never fetched and the slot stays an empty, correctly-sized box.
const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const MoonSlot = () => {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasWebGL()) return; // decorative: no WebGL, no moon, no error
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
        <DecorativeBoundary>
          <Suspense fallback={null}>
            <DepthImage
              image="/photos/about-depth.webp"
              lightColor="#f3e6ff"
              lightIntensity={5}
            />
          </Suspense>
        </DecorativeBoundary>
      )}
    </div>
  );
};

const About = () => {
  return (
    <div id="about">

      <div className="work-wrapper">
        <AboutHeading />
        <Polaroids />
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
