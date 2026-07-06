import { useState } from 'react';
import Seo from '../util/Seo';
import { BOOK_CALL_URL } from '../../data/cta';
import '../../styles/components/partnersPage.scss';

/* ------------------------------------------------------------------ *
 * Hidden agency-wholesale offer — the content behind the /partners
 * password gate.
 *
 * Reached ONLY through PartnersGate after its SHA-256 password check passes,
 * so this chunk never loads for a visitor who hasn't unlocked. Canonical is
 * the fixed /partners. NOT linked from nav/footer, absent from the sitemap,
 * noindex,nofollow (below + an X-Robots-Tag header in netlify.toml). Dark
 * (is-dark) route, so it inherits the #000 backdrop — no LIGHT_ROUTES entry.
 * ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'hello@switchcasestudio.com';
const MAILTO = `mailto:${CONTACT_EMAIL}`;

// TODO: replace with the dedicated 20-min intro-call booking link
// (Cal.com / Calendly / Google Calendar). Falls back to the studio's main
// booking calendar (src/data/cta.js) so the button works until the real
// link lands. The delegated GA listener (initInteractionTracking)
// auto-fires book_call_click on any calendar.app.google href.
const INTRO_CALL_URL = BOOK_CALL_URL;

const AUDIENCE = [
  'Performance marketing agencies',
  'PPC, SEO, and growth agencies',
  'Brand and design shops without internal dev',
  'Anyone running paid traffic to client pages that need to convert better than templates allow',
];

const STEPS = [
  {
    title: 'You send a brief.',
    body: 'Audience, offer, brand assets, reference designs if any.',
  },
  {
    title: 'We turn it around in 5–7 business days.',
    body: 'One dedicated build, no queue behind other clients.',
  },
  {
    title: 'You receive a fully built, responsive, conversion-optimized landing page.',
    body: 'Handed off as code or shipped to your stack — Webflow, Framer, Next.js, plain HTML.',
  },
  {
    title: 'Two rounds of revisions included.',
    body: 'Sign-off comes from you, not the end client.',
  },
];

const INCLUDED = [
  'Full custom design (no templates)',
  'Mobile-responsive build',
  'Two rounds of revisions',
  'SEO meta basics, OG image, favicon',
  'Handoff in your preferred format',
  'Performance budget (LCP < 2.5s, CLS < 0.1)',
];

const NOT_INCLUDED = [
  'Copywriting (you supply, or +$200/page)',
  'Custom illustration / 3D / video (scoped separately)',
  'Tracking setup beyond GA4 basics (scoped separately)',
  'Client-facing communication (we work with you, not your client)',
  'Hosting (you handle it, or +monthly fee)',
];

const FIT = [
  'Performance agencies running paid traffic at scale who need page variants weekly',
  'SEO agencies whose clients need landing pages for high-intent keywords',
  'Branding shops without internal dev who don’t want to subcontract through random freelancers',
];

const NEEDS = [
  'A signed mutual NDA (we’ll send the template)',
  'A predictable volume (1+ pages per month is the minimum to keep slots open)',
  'A primary point of contact who can sign off on revisions without going back to the client',
];

const FAQS = [
  {
    question: 'Can you white-label?',
    answer:
      'Yes. We don’t exist as far as your client is concerned.',
  },
  {
    question: 'What if I need it in 48 hours?',
    answer: 'Possible at +50% rush fee. Ask first.',
  },
  {
    question: 'Do you do A/B variants?',
    answer: 'Yes — $200 per variant after the first.',
  },
  {
    question: 'What if my client wants to keep working with you after?',
    answer: 'We refer them back to you. Always.',
  },
  {
    question: 'What stack do you build in?',
    answer:
      'Whatever ships fastest for the use case. Default is plain HTML/CSS/JS unless you specify otherwise.',
  },
];

/* ------------------------------------------------------------------ *
 * FAQ accordion row — open/close state local to the row. Markup mirrors
 * the site's shared Faq component (button + plus/minus icon lines +
 * grid-rows answer reveal) so it reads and animates identically.
 * ------------------------------------------------------------------ */
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`partners-faq__item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="partners-faq__button"
        aria-expanded={isOpen}
      >
        <span className="partners-faq__question">{question}</span>
        <span className="partners-faq__icon" aria-hidden="true">
          <span className="partners-faq__icon-line partners-faq__icon-line--horizontal" />
          <span className="partners-faq__icon-line partners-faq__icon-line--vertical" />
        </span>
      </button>

      <div className="partners-faq__answer-wrap">
        <div className="partners-faq__answer-inner">
          <p className="partners-faq__answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}

const PartnersPage = () => {
  return (
    <main className="partners">
      <Seo
        title="Agency Partners — Wholesale Landing Pages | Switch Case Studio"
        description="White-label landing pages for agencies at $400 per page. You sell the strategy, we build the pages. 5–7 day turnaround, conversion-optimized, handed off in your stack."
        path="/partners"
        robots="noindex, nofollow"
      />

      {/* ---------------- HERO ---------------- */}
      <header className="partners__hero">
        <div className="partners__container">
          <p className="partners__eyebrow">White-label · For agencies only</p>
          <h1 className="partners__headline">
            <span>Agency partners.</span>
            <span>Wholesale landing pages.</span>
            <span className="partners__headline-accent">$400 per page.</span>
          </h1>
          <p className="partners__lede">
            You sell the strategy. We build the pages. You ship faster, your
            clients see better results, and nobody knows we exist unless you
            want them to.
          </p>
          <div className="partners__cta-row">
            <a className="partners__btn partners__btn--primary" href={MAILTO}>
              Get in touch
            </a>
            <a
              className="partners__btn partners__btn--ghost"
              href="#partners-faq"
            >
              Read the FAQ
              <span className="partners__btn-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* ---------------- WHO THIS IS FOR ---------------- */}
      <section className="partners__section">
        <div className="partners__container">
          <p className="partners__kicker">01</p>
          <h2 className="partners__h2">Who this is for</h2>
          <ul className="partners__pills">
            {AUDIENCE.map((item) => (
              <li key={item} className="partners__pill">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="partners__section">
        <div className="partners__container">
          <p className="partners__kicker">02</p>
          <h2 className="partners__h2">How it works</h2>
          <ol className="partners__steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="partners__step">
                <span className="partners__step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="partners__step-body">
                  <h3 className="partners__step-title">{step.title}</h3>
                  <p className="partners__step-text">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- INCLUDED / NOT INCLUDED ---------------- */}
      <section className="partners__section">
        <div className="partners__container">
          <p className="partners__kicker">03</p>
          <h2 className="partners__h2">What’s included at $400</h2>
          <div className="partners__cols">
            <div className="partners__col partners__col--in">
              <p className="partners__col-label">Included</p>
              <ul className="partners__list">
                {INCLUDED.map((item) => (
                  <li key={item} className="partners__list-item">
                    <span
                      className="partners__mark partners__mark--yes"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="partners__col partners__col--out">
              <p className="partners__col-label">Not included</p>
              <ul className="partners__list">
                {NOT_INCLUDED.map((item) => (
                  <li key={item} className="partners__list-item">
                    <span
                      className="partners__mark partners__mark--no"
                      aria-hidden="true"
                    >
                      –
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- WHY $400 vs $800 — the emphasis block ---------------- */}
      <section className="partners__why">
        <div className="partners__container">
          <p className="partners__kicker partners__kicker--on-dark">04</p>
          <div className="partners__why-prices">
            <div className="partners__price partners__price--retail">
              <span className="partners__price-tag">$800</span>
              <span className="partners__price-note">Public / retail tier</span>
            </div>
            <span className="partners__price-vs" aria-hidden="true">
              →
            </span>
            <div className="partners__price partners__price--wholesale">
              <span className="partners__price-tag">$400</span>
              <span className="partners__price-note">Agency wholesale</span>
            </div>
          </div>
          <h2 className="partners__why-h2">Why $400 wholesale vs $800 retail</h2>
          <p className="partners__why-text">
            Our public landing-page tier is $800 because it includes the
            strategy call, client onboarding, mid-project check-ins, end-client
            revisions, and ongoing post-launch support. The wholesale rate
            strips all of that.{' '}
            <strong>You handle the client. We handle the build.</strong>
          </p>
        </div>
      </section>

      {/* ---------------- EXAMPLE PARTNERS WE'RE A FIT FOR ---------------- */}
      <section className="partners__section">
        <div className="partners__container">
          <p className="partners__kicker">05</p>
          <h2 className="partners__h2">Example partners we’re a fit for</h2>
          <ul className="partners__fit">
            {FIT.map((item) => (
              <li key={item} className="partners__fit-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- WHAT WE NEED FROM YOU ---------------- */}
      <section className="partners__section">
        <div className="partners__container">
          <p className="partners__kicker">06</p>
          <h2 className="partners__h2">What we need from you</h2>
          <ul className="partners__needs">
            {NEEDS.map((item, i) => (
              <li key={item} className="partners__need">
                <span className="partners__need-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="partners-faq" className="partners__section partners-faq">
        <div className="partners__container">
          <p className="partners__kicker">07</p>
          <h2 className="partners__h2">FAQ</h2>
          <div className="partners-faq__list">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="partners__final">
        <div className="partners__container">
          <h2 className="partners__final-h2">Let’s talk volume.</h2>
          <div className="partners__cta-row partners__cta-row--center">
            <a className="partners__btn partners__btn--primary" href={MAILTO}>
              Email {CONTACT_EMAIL}
            </a>
            {/* TODO: swap INTRO_CALL_URL for the dedicated 20-min intro-call link */}
            <a
              className="partners__btn partners__btn--ghost"
              href={INTRO_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 20-min intro call
              <span className="partners__btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnersPage;
