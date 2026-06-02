import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPageView, initInteractionTracking } from "./ga";

/**
 * Mount once inside the Router. Initialises GA4 + interaction tracking on first
 * render, then sends a page_view on every route change. Renders nothing.
 *
 * Title timing: pages are lazy-loaded and set their <title> via
 * react-helmet-async, both async — a fixed delay races them (lazy chunks can
 * arrive hundreds of ms later). So we send page_view as soon as the <title>
 * actually changes (MutationObserver), with a fallback timer for routes that
 * keep the same title, and a flush on unmount so a fast follow-up navigation
 * never drops a view. A guard ensures exactly one page_view per route.
 */
export default function RouteAnalytics() {
  const location = useLocation();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    initGA();
    const cleanup = initInteractionTracking();
    return cleanup;
  }, []);

  useEffect(() => {
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      trackPageView({
        path: location.pathname + location.search,
        title: document.title,
      });
    };

    const titleEl = document.querySelector("title");
    let observer;
    if (titleEl && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(send);
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    // Fallback: routes that don't change the title still report (max 1s wait).
    const fallback = setTimeout(send, 1000);

    return () => {
      clearTimeout(fallback);
      if (observer) observer.disconnect();
      send(); // flush before the next route swaps in
    };
  }, [location.pathname, location.search]);

  return null;
}
