import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bannerVideo from '../../assets/videos/switch-case-studio-banner.webm';
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

  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  /* ------------------------------------------------------------------ *
   * Submit handler — EmailJS using existing template fields:
   *   first_name, last_name, email, message
   * ------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed || status === 'sending') return;

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

  const canSubmit = agreed && status !== 'sending';

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-section__inner">
        <div className="contact-grid">
          {/* ---------- Left Column ---------- */}
          <div className="contact-left">
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

              <a
                className="contact-left__cta"
                href="https://calendar.app.google/83UCJjis2FHUrr1s6"
                target="_blank"
                rel="noreferrer"
              >
                Book a Strategy Call →
              </a>

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
          </div>

          {/* ---------- Right Column: Form ---------- */}
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
              <div className="contact-form__row contact-form__row--split">
                <div className="contact-form__field">
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First name"
                    required
                    aria-label="First name"
                  />
                </div>
                <div className="contact-form__field">
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last name"
                    required
                    aria-label="Last name"
                  />
                </div>
              </div>

              <div className="contact-form__field">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  required
                  aria-label="Email"
                />
              </div>

              <div className="contact-form__field">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Type your message..."
                  rows={1}
                  required
                  aria-label="Message"
                />
              </div>

              {/* Privacy checkbox — gates submission */}
              <div className="contact-form__consent">
                <button
                  type="button"
                  onClick={() => setAgreed((prev) => !prev)}
                  className={`contact-form__checkbox ${
                    agreed ? 'contact-form__checkbox--checked' : ''
                  }`}
                  aria-label="Agree to privacy statement"
                  aria-pressed={agreed}
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
                <label className="contact-form__consent-label">
                  I have read and understood the{' '}
                  <Link to="/privacy">privacy statement</Link>
                </label>
              </div>

              {/* Submit + status */}
              <div className="contact-form__submit-row">
                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={!canSubmit}
                >
                  {status === 'sending' ? 'Sending…' : 'Submit'}
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
