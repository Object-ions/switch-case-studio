import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Seo from '../util/Seo';
import { trackEvent } from '../../analytics/ga';
import ModuleGrid from '../promo/ModuleGrid';
import SplatBadge from '../promo/SplatBadge';
import '../../styles/components/promoPage.scss';

/* ------------------------------------------------------------------ *
 * Flip-it-later switches (one line each).
 * ------------------------------------------------------------------ */
// Set true to let the promo into the index + sitemap. Drives the robots tag.
export const PROMO_INDEXABLE = false;
// Sale end date, surfaced in the body copy. Edit this one line to change it.
export const DEADLINE = 'June 30, 2026';

// Tags this lead's origin in EmailJS (hidden field) and in GA generate_lead.
const SOURCE = '30-off-promo';
// Reuse the studio's existing booking calendar — the delegated GA listener
// (initInteractionTracking) auto-fires book_call_click on this href.
const BOOKING_URL = 'https://calendar.app.google/nSyFwz22pSVgMAhK8';

const {
  VITE_EMAILJS_SERVICE_ID,
  VITE_EMAILJS_TEMPLATE_ID,
  VITE_EMAILJS_USER_ID,
} = import.meta.env;

const PROJECT_TYPES = [
  'Website',
  'Landing page',
  'Branding',
  'SEO',
  'Performance',
  'Other',
];

const PromoPage = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Honeypot: a real person leaves it empty. If it's filled, a bot did —
    // report success to it and send nothing.
    if (formRef.current?.elements?.company?.value) {
      setStatus('success');
      return;
    }

    // Phone is required. Lenient format: allow + spaces dashes parens dots,
    // need ~7+ actual digits. Form has noValidate, so this gate (not the
    // browser) is what blocks an empty/garbage submit. Mirrors the Contact form.
    const phone = formRef.current?.elements?.phone?.value?.trim() || '';
    const phoneValid =
      /^[+\d\s().-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7;
    if (!phoneValid) {
      setPhoneError('Add a phone number we can reach you on');
      formRef.current?.elements?.phone?.focus();
      return;
    }
    setPhoneError('');

    setStatus('sending');
    // Fire synchronously in the submit gesture stack (like book_call_click),
    // not inside the async EmailJS .then — an event fired after the network
    // round-trip was being lost. Counts a valid submit (passed validation, not
    // the honeypot). trackEvent is consent-safe: Consent Mode v2 still sends a
    // cookieless ping when denied.
    trackEvent('generate_lead', { source: SOURCE });

    emailjs
      .sendForm(
        VITE_EMAILJS_SERVICE_ID,
        VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        VITE_EMAILJS_USER_ID,
      )
      .then(
        () => {
          setStatus('success');
          formRef.current?.reset();
        },
        () => setStatus('error'),
      );
  };

  return (
    <main className="promo">
      <Seo
        title="30% off everything — Switch Case Studio"
        description={`30% off every service — websites, development, branding, SEO, performance. Limited-time studio sale, ends ${DEADLINE}.`}
        path="/30-off"
        image="/promo/og-30-off.png"
        imageAlt="Switch Case Studio — 30% off everything"
        robots={PROMO_INDEXABLE ? undefined : 'noindex,follow'}
      />

      {/* Decorative animated module field behind the content */}
      <ModuleGrid className="promo__grid" />

      <div className="promo__inner">
        <SplatBadge className="promo__splat" />

        <p className="promo__brand">Design. Development. Marketing.</p>

        <div className="promo__hero">
          <h1 className="promo__title">30% off everything.</h1>
        </div>

        <p className="promo__sub">On every service. Ends {DEADLINE}.</p>

        <p className="promo__services">
          Web · Development · Branding · SEO · Performance
        </p>

        <a className="promo__cta" href={BOOKING_URL} target="_blank" rel="noreferrer">
          Book a call →
        </a>

        <p className="promo__url">switchcasestudio.com/30-off</p>

        {/* ---------------- Lead form ---------------- */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="promo-form"
          noValidate
        >
          {/* Honeypot — visually hidden, off the tab order, ignored by humans */}
          <div className="promo-form__hp" aria-hidden="true">
            <label htmlFor="promo-company">Company</label>
            <input
              type="text"
              id="promo-company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Origin tag for EmailJS — add {{source}} to the template to surface */}
          <input type="hidden" name="source" value={SOURCE} readOnly />

          <div className="promo-form__field">
            <label htmlFor="promo-name">Full name</label>
            <input
              type="text"
              id="promo-name"
              name="first_name"
              required
              autoComplete="name"
            />
          </div>

          <div className="promo-form__field">
            <label htmlFor="promo-email">Email</label>
            <input
              type="email"
              id="promo-email"
              name="email"
              required
              autoComplete="email"
            />
          </div>

          <div className="promo-form__field">
            <label htmlFor="promo-phone">Phone</label>
            <input
              type="tel"
              id="promo-phone"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              required
              aria-required="true"
              aria-invalid={phoneError ? 'true' : undefined}
              aria-describedby={phoneError ? 'promo-phone-error' : undefined}
              onChange={() => phoneError && setPhoneError('')}
            />
            {phoneError && (
              <p
                id="promo-phone-error"
                className="promo-form__error"
                role="alert"
              >
                {phoneError}
              </p>
            )}
          </div>

          <div className="promo-form__field">
            <label htmlFor="promo-type">Project type</label>
            <select id="promo-type" name="project_type" defaultValue="">
              <option value="">Choose one (optional)</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="promo-form__field">
            <label htmlFor="promo-message">Message</label>
            <textarea
              id="promo-message"
              name="message"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            className="promo-form__submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Claim 30% off'}
          </button>

          {status === 'success' && (
            <p className="promo-form__status promo-form__status--ok" role="status">
              You're in. We'll reply within one business day with next steps to
              lock in your 30%.
            </p>
          )}
          {status === 'error' && (
            <p
              className="promo-form__status promo-form__status--err"
              role="alert"
            >
              That didn't send. Check your email address and try again, or write
              to hello@switchcasestudio.com.
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default PromoPage;
