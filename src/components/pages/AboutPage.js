import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'motion/react';
import {
  headerVariants,
  lineVariant,
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import '../../styles/components/aboutPage.scss';

const CAPABILITIES = [
  {
    title: 'Websites',
    body: 'Marketing sites, portfolio sites, and brand-forward web presence — built from scratch, never from a template.',
  },
  {
    title: 'E-commerce',
    body: 'Product-first stores designed around the full buyer journey. Shopify, WooCommerce, custom — whatever the product needs.',
  },
  {
    title: 'Apps & Automation',
    body: 'Web apps, dashboards, and integration workflows built with React. We connect the tools and build the interfaces that run your business.',
  },
];

const VALUES = [
  {
    label: 'Scratch, not templates',
    desc: 'Every project starts from a blank canvas. No themes, no page builders, no shortcuts.',
  },
  {
    label: 'Fast delivery',
    desc: 'Most builds ship in under two weeks without cutting corners on quality.',
  },
  {
    label: 'Direct collaboration',
    desc: 'You work with the people actually building your project — not an account manager.',
  },
  {
    label: 'Conversion-focused',
    desc: 'Design follows function. We care about results, not just how things look.',
  },
];

const AboutPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);

  return (
    <>
      <Helmet>
        <title>About — Switch Case Studio</title>
        <meta
          name="description"
          content="Switch Case Studio is a design-led digital studio building websites, e-commerce stores, and apps from scratch. Fast turnaround, personal attention, no templates."
        />
        <link rel="canonical" href="https://switchcasestudio.com/about" />
        <meta property="og:title" content="About — Switch Case Studio" />
        <meta
          property="og:description"
          content="Design-led digital studio building websites, e-commerce stores, and apps from scratch."
        />
      </Helmet>

      <article className="about-page" aria-label="About Switch Case Studio">
        {/* ── Hero ── */}
        <motion.header
          className="about-page__hero"
          variants={v(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className="about-page__kicker" variants={v(lineVariant)}>
            Our Studio
          </motion.p>
          <motion.h1 className="about-page__title" variants={v(lineVariant)}>
            Design-led.
            <br />
            <span className="about-page__title--accent">Results-driven.</span>
          </motion.h1>
          <motion.p className="about-page__lede" variants={v(lineVariant)}>
            Switch Case Studio is a boutique digital studio building websites,
            e-commerce stores, and web apps from scratch — for businesses that
            take their digital presence seriously.
          </motion.p>
        </motion.header>

        {/* ── Story ── */}
        <section className="about-page__story" aria-labelledby="about-story-heading">
          <motion.div
            className="about-page__story-inner"
            variants={v(cardVariants)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="about-page__story-text">
              <h2 id="about-story-heading" className="about-page__section-label">
                The Studio
              </h2>
              <p>
                We're a small, focused studio — which means every project gets
                personal attention from the people actually building it. Our
                clients include medical spas, real estate firms, e-commerce
                brands, and marketing companies across the US.
              </p>
              <p>
                We move fast without cutting corners. Most sites ship in under
                two weeks, with a design-to-launch process that keeps you in the
                loop without drowning you in it. Whether it's a campaign page, a
                full Shopify store, or a custom web app — everything starts from
                scratch.
              </p>
            </div>
            <div className="about-page__stat-col">
              <div className="about-page__stat">
                <span className="about-page__stat-value">7+</span>
                <span className="about-page__stat-label">Clients launched</span>
              </div>
              <div className="about-page__stat">
                <span className="about-page__stat-value">&lt;2wk</span>
                <span className="about-page__stat-label">Avg. turnaround</span>
              </div>
              <div className="about-page__stat">
                <span className="about-page__stat-value">0</span>
                <span className="about-page__stat-label">Templates used</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Capabilities ── */}
        <section className="about-page__capabilities" aria-labelledby="about-caps-heading">
          <div className="about-page__section-wrap">
            <h2 id="about-caps-heading" className="about-page__section-label">
              What we build
            </h2>
            <motion.div
              className="about-page__caps-grid"
              variants={v(containerVariants)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {CAPABILITIES.map((cap) => (
                <motion.div
                  key={cap.title}
                  className="about-page__cap"
                  variants={v(cardVariants)}
                >
                  <h3 className="about-page__cap-title">{cap.title}</h3>
                  <p className="about-page__cap-body">{cap.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="about-page__values" aria-labelledby="about-values-heading">
          <div className="about-page__section-wrap">
            <h2 id="about-values-heading" className="about-page__section-label">
              How we work
            </h2>
            <motion.div
              className="about-page__values-grid"
              variants={v(containerVariants)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {VALUES.map((value) => (
                <motion.div
                  key={value.label}
                  className="about-page__value"
                  variants={v(cardVariants)}
                >
                  <strong className="about-page__value-label">{value.label}</strong>
                  <p className="about-page__value-desc">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <motion.section
          className="about-page__cta"
          aria-labelledby="about-cta-heading"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 id="about-cta-heading" className="about-page__cta-heading">
            Ready to build something?
          </h2>
          <p className="about-page__cta-body">
            Tell us about your project. We'll come back with a plan.
          </p>
          <div className="about-page__cta-actions">
            <a
              href="https://calendar.app.google/83UCJjis2FHUrr1s6"
              target="_blank"
              rel="noopener noreferrer"
              className="about-page__cta-btn about-page__cta-btn--primary"
            >
              Book a Free Call
            </a>
            <Link to="/projects" className="about-page__cta-btn about-page__cta-btn--secondary">
              See Our Work →
            </Link>
          </div>
        </motion.section>
      </article>
    </>
  );
};

export default AboutPage;
