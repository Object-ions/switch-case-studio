import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bannerVideo from '../../assets/videos/switch-case-studio-banner.webm';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/contact.scss';


const {
  VITE_EMAILJS_SERVICE_ID,
  VITE_EMAILJS_TEMPLATE_ID,
  VITE_EMAILJS_USER_ID,
} = import.meta.env;

/* ------------------------------------------------------------------ *
 * Social links (left column)
 * Commented out until accounts exist. ESLint disabled for the unused
 * `socials` array so Netlify CI doesn't fail on `no-unused-vars`.
 * ------------------------------------------------------------------ */
// eslint-disable-next-line no-unused-vars
const socials = [
  // { key: 'li', label: 'LinkedIn',  href: 'https://linkedin.com/company/your-handle' },
  // { key: 'ig', label: 'Instagram', href: 'https://instagram.com/your-handle' },
  // { key: 'x',  label: 'X',         href: 'https://x.com/your-handle' },
  // { key: 'yt', label: 'YouTube',   href: 'https://youtube.com/@your-handle' },
];

// headingTag: 'h1' when Contact IS the page (/contact), 'h2' when it's a
// section on the home page — a page must have exactly one h1.
const Contact = ({ headingTag: HeadingTag = 'h2' }) => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const videoRef = useRef(null);

  const consentRef = useRef(null);

  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [phoneError, setPhoneError] = useState('');
  const [consentError, setConsentError] = useState('');

  /* ------------------------------------------------------------------ *
   * Submit handler — EmailJS using existing template fields:
   *   first_name, email, phone, message
   * (last_name dropped in the 2026-07 refresh, DESIGN_AUDIT P0-3 — the
   * shared template already tolerates absent fields: the promo form sends
   * no last_name to the same template.)
   * ------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Consent gates SUBMISSION, not the button — a disabled-looking primary
    // suppressed attempts (DESIGN_AUDIT P0-3). Explain + focus instead.
    if (!agreed) {
      setConsentError('Please tick the privacy box first — then send.');
      consentRef.current?.focus();
      return;
    }

    // Phone is OPTIONAL (required cost completions); when provided, check
    // the format: allow + spaces dashes parens dots, need ~7+ digits.
    // Form has noValidate, so this gate (not the browser) does the work.
    const phone = formRef.current?.elements?.phone?.value?.trim() || '';
    const phoneValid =
      /^[+\d\s().-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7;
    if (phone && !phoneValid) {
      setPhoneError("That phone number doesn't look complete");
      formRef.current?.elements?.phone?.focus();
      return;
    }
    setPhoneError('');

    setStatus('sending');

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
          setAgreed(false);
          // Auto-revert to idle after 5s so the form is reusable
          setTimeout(() => setStatus('idle'), 5000);
        },
        () => {
          setStatus('error');
          setTimeout(() => setStatus('idle'), 5000);
        },
      );
  };

  /* ------------------------------------------------------------------ *
   * Subtle fade-up entrance — matches the new Footer pattern
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.contact-animate');
      gsap.fromTo(
        targets,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------ *
   * Respect prefers-reduced-motion: pause the looping banner if the
   * user has motion sensitivity enabled at the OS level.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  // Only an in-flight send disables the button. Consent is enforced in
  // handleSubmit with a visible explanation — a permanently disabled-looking
  // primary button read as dead and suppressed attempts (DESIGN_AUDIT P0-3).
  const canSubmit = status !== 'sending';

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-section__inner">
        {/* Stacked flow (2026-07 pre-P1 tweak, Moses's on-device review):
            the FORM is the first thing a visitor sees; the contact-info block
            and the decorative banner card follow BELOW it (mobile top-to-
            bottom: form → info → graphic; ≥769px the bottom pair sits as one
            row, info left / graphic right). Was a side-by-side grid with the
            graphic + info first in DOM, which buried the form on phones. */}
        <div className="contact-grid">
          {/* ---------- Form (first) ---------- */}
          <div className="contact-right">
            <HeadingTag className="contact-right__heading contact-animate">
              Contact us
            </HeadingTag>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form contact-animate"
              noValidate
            >
              {/* Visible persistent labels (placeholder-only labels vanish on
                  focus and doubled as the only affordance — P0-3). Field name
                  stays `first_name` for EmailJS-template compatibility; it now
                  carries the full name (autoComplete="name"). */}
              <div className="contact-form__field">
                <label htmlFor="first_name" className="contact-form__label">
                  Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="email" className="contact-form__label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact-form__field contact-form__field--phone">
                <label htmlFor="phone" className="contact-form__label">
                  Phone <span className="contact-form__optional">(optional — if you'd rather talk)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={phoneError ? 'true' : undefined}
                  aria-describedby={phoneError ? 'phone-error' : undefined}
                  onChange={() => phoneError && setPhoneError('')}
                />
                {phoneError && (
                  <p
                    id="phone-error"
                    className="contact-form__error"
                    role="alert"
                  >
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="contact-form__field">
                <label htmlFor="message" className="contact-form__label">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Tell us about your project…"
                  rows={3}
                  required
                />
              </div>

              {/* Privacy checkbox — gates submission in handleSubmit (with an
                  explanatory error), NOT via a disabled submit button. */}
              <div className="contact-form__consent">
                <button
                  ref={consentRef}
                  type="button"
                  onClick={() => {
                    setAgreed((prev) => !prev);
                    setConsentError('');
                  }}
                  className={`contact-form__checkbox ${
                    agreed ? 'contact-form__checkbox--checked' : ''
                  }`}
                  aria-label="Agree to privacy statement"
                  aria-pressed={agreed}
                  aria-describedby={consentError ? 'consent-error' : undefined}
                >
                  {agreed && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                {/* Clicking the words toggles too — a text-adjacent checkbox
                    that ignores its own label reads as broken. */}
                <label
                  className="contact-form__consent-label"
                  onClick={(e) => {
                    // Let the privacy link navigate; toggle on any other click.
                    if (e.target.closest('a')) return;
                    setAgreed((prev) => !prev);
                    setConsentError('');
                  }}
                >
                  I have read and understood the{' '}
                  <Link to="/privacy">privacy statement</Link>
                </label>
              </div>
              {consentError && (
                <p
                  id="consent-error"
                  className="contact-form__error"
                  role="alert"
                >
                  {consentError}
                </p>
              )}

              {/* Submit + status */}
              <div className="contact-form__submit-row">
                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={!canSubmit}
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>

                {status === 'success' && (
                  <p
                    className="contact-form__status contact-form__status--success"
                    role="status"
                  >
                    Message sent — we'll be in touch shortly.
                  </p>
                )}
                {status === 'error' && (
                  <p
                    className="contact-form__status contact-form__status--error"
                    role="alert"
                  >
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* ---------- Contact info + banner graphic (below the form) ---------- */}
          <div className="contact-left">
            <div className="contact-left__details contact-animate">
              <p className="contact-left__address">
                Switch Case Studio
                <br />
                Portland, Oregon
              </p>

              <a
                className="contact-left__email"
                href="mailto:hello@switchcasestudio.com"
              >
                hello@switchcasestudio.com
              </a>

              <BookCallCta className="contact-left__cta"> →</BookCallCta>

              {socials.length > 0 && (
                <div className="contact-left__socials">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="contact-left__media contact-animate">
              <video
                ref={videoRef}
                className="contact-left__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src={bannerVideo} type="video/webm" />
                {/* Add an mp4 fallback here once you've encoded one:
                <source src={bannerVideoMp4} type="video/mp4" />
                */}
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
