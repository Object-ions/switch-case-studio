import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function getHeaderOffset() {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 0;
}

export default function ScrollToTop() {
  const location = useLocation();
  const { pathname, hash, state } = location;

  useEffect(() => {
    // Helper to run on the next paint (after layout)
    const nextFrame = (fn) =>
      requestAnimationFrame(() => requestAnimationFrame(fn));

    // A) One-shot restoration after closing modal with X/backdrop/ESC
    const preserve = sessionStorage.getItem('preserveScroll') === '1';
    if (preserve) {
      const y = parseFloat(sessionStorage.getItem('preserveScrollY') || '0');
      // clear flags before applying (one-shot)
      try {
        sessionStorage.removeItem('preserveScroll');
        sessionStorage.removeItem('preserveScrollY');
      } catch {}
      nextFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      });
      return; // nothing else
    }

    // B) Explicit state request to preserve scroll (defensive)
    if (state && state.preserveScroll) {
      return;
    }

    // C) No hash → normal route change → scroll to top
    if (!hash) {
      nextFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
      return;
    }

    // D) Hash present → wait until element exists, then scroll with header offset
    let attempts = 0;
    const maxAttempts = 40; // ~2s @ 50ms
    const interval = setInterval(() => {
      attempts += 1;
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const offset = getHeaderOffset() + 8; // small breathing room
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [pathname, hash, state]);

  return null;
}
