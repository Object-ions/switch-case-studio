/**
 * Google Analytics 4 (gtag.js) — dependency-free integration.
 *
 * Configuration is via environment variables (Create React App bakes these in
 * at BUILD time, so you must rebuild/redeploy after changing them):
 *
 *   REACT_APP_GA_MEASUREMENT_ID   GA4 Measurement ID, e.g. "G-XXXXXXXXXX"
 *   REACT_APP_GA_DEBUG=true       (optional) also send from a local/dev build
 *
 * Analytics is OFF unless a Measurement ID is present AND the build is a
 * production build (or REACT_APP_GA_DEBUG=true). This keeps local dev and the
 * test runner from polluting real reports.
 *
 * See GA4-SETUP.md for the Google-side setup that produces the Measurement ID.
 */

export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const FORCE_DEBUG = process.env.REACT_APP_GA_DEBUG === "true";

export const analyticsEnabled =
  Boolean(GA_MEASUREMENT_ID) &&
  (process.env.NODE_ENV === "production" || FORCE_DEBUG);

// URL fragment that identifies the primary conversion CTA (the booking calendar).
const BOOKING_URL_MATCH = "calendar.app.google";

let scriptInjected = false;

// localStorage key holding the visitor's consent choice ("granted" | "denied").
export const CONSENT_KEY = "scs-analytics-consent";

/** The stored consent choice, or null if the visitor hasn't chosen yet. */
export function getStoredConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

const GRANTED = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};
const DENIED = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/**
 * Inject gtag.js once and configure the property. page_view is sent manually
 * (send_page_view:false) because this is a single-page app — see trackPageView.
 *
 * Consent Mode v2: consent defaults to DENIED, so until the visitor opts in GA
 * runs cookieless (no analytics/ads cookies — only anonymous, modeled pings).
 * A previously stored "granted" choice is re-applied so returning visitors
 * aren't re-prompted.
 */
export function initGA() {
  if (!analyticsEnabled || scriptInjected || typeof window === "undefined") return;
  scriptInjected = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Must be set before config (and before any event) — queued ahead in dataLayer.
  gtag("consent", "default", { ...DENIED, wait_for_update: 500 });
  if (getStoredConsent() === "granted") {
    gtag("consent", "update", GRANTED);
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // SPA: we fire page_view on each route change
    ...(FORCE_DEBUG ? { debug_mode: true } : {}),
  });
}

/** Persist the visitor's consent choice and update gtag's consent state live. */
export function setConsent(granted) {
  const value = granted ? "granted" : "denied";
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable (private mode) — choice just won't persist */
  }
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", granted ? GRANTED : DENIED);
  }
}

/** Send a SPA page_view. Call after the route (and document.title) has updated. */
export function trackPageView({ path, title } = {}) {
  if (!analyticsEnabled || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

/** Send a custom GA4 event. */
export function trackEvent(name, params = {}) {
  if (!analyticsEnabled || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * One delegated click listener that captures the conversions that matter:
 *   - book_call_click  → any link to the booking calendar (the key conversion)
 *   - email_click      → mailto: links
 *   - phone_click      → tel: links
 * Centralised so the 13+ scattered "Book a Free Call" CTAs need no edits and
 * any future CTA is covered automatically. Returns a cleanup function.
 */
export function initInteractionTracking() {
  if (!analyticsEnabled || typeof document === "undefined") return () => {};

  const onClick = (e) => {
    const anchor = e.target.closest && e.target.closest("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const shared = {
      link_url: href,
      link_text: (anchor.textContent || "").trim().slice(0, 100),
      page_path: window.location.pathname,
    };

    if (href.includes(BOOKING_URL_MATCH)) {
      trackEvent("book_call_click", shared);
    } else if (href.startsWith("mailto:")) {
      trackEvent("email_click", shared);
    } else if (href.startsWith("tel:")) {
      trackEvent("phone_click", shared);
    }
  };

  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
