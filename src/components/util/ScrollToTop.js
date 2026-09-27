import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function getHeaderOffset() {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 0;
}

export default function ScrollToTop() {
  const location = useLocation();
  const { pathname, hash } = location;

  useEffect(() => {
    // Helper to run on the next paint (after layout)
    const nextFrame = (fn) =>
      requestAnimationFrame(() => requestAnimationFrame(fn));

    // A) STANDARD NAVIGATION (no hash) → instant scroll to top.
    // 'auto' (instant) is less jarring than 'smooth' on every route
    // change, and matches user expectations for new pages.
    if (!hash) {
      nextFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
      return;
    }

    // B) HASH NAVIGATION → wait for element, then scroll
    let attempts = 0;
    const maxAttempts = 40; // ~2s @ 50ms
    const interval = setInterval(() => {
      attempts += 1;
      const id = hash.slice(1);
      const el = document.getElementById(id);

      if (el) {
        const offset = getHeaderOffset() + 20; // +20px breathing room
        // Layout position (offsetTop chain), not the rect: a page reveal
        // holds its targets on a translateY while this measures (the
        // pricing boards sit 24px low at hydration), and a rect-based
        // target then lands the element under the fixed header.
        let top = -offset;
        for (let n = el; n; n = n.offsetParent) top += n.offsetTop;

        window.scrollTo({ top, behavior: 'smooth' });
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [pathname, hash]);

  return null;
}
