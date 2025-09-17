import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function getHeaderOffset() {
  const header = document.querySelector(".site-header");
  return header ? header.offsetHeight : 0;
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Helper to run on the next paint
    const nextFrame = (fn) =>
      requestAnimationFrame(() => requestAnimationFrame(fn));

    if (!hash) {
      // Normal route change (e.g., to pricing subpages) — scroll to top
      nextFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
      return;
    }

    // Hash present — wait until the element exists, then scroll with header offset
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
        window.scrollTo({ top, behavior: "smooth" });
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [pathname, hash]);

  return null;
}
