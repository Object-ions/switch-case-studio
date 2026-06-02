import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsEnabled, getStoredConsent, setConsent } from "./ga";
import "../styles/components/consentBanner.scss";

/**
 * Cookie-consent banner for GA4 Consent Mode v2. Shows only when analytics is
 * actually enabled (a Measurement ID is configured) AND the visitor hasn't yet
 * chosen. Accept/Decline calls setConsent(), which persists the choice and
 * updates gtag's consent state live — no reload needed.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (analyticsEnabled && !getStoredConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (granted) => {
    setConsent(granted);
    setVisible(false);
  };

  return (
    <div
      className="consent-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <p className="consent-banner__text">
        We use cookies to measure how visitors use this site. You can accept
        analytics or decline — declining keeps tracking off.{" "}
        <Link to="/privacy" className="consent-banner__link">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="consent-banner__actions">
        <button
          type="button"
          className="consent-banner__btn consent-banner__btn--ghost"
          onClick={() => choose(false)}
        >
          Decline
        </button>
        <button
          type="button"
          className="consent-banner__btn consent-banner__btn--primary"
          onClick={() => choose(true)}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
