import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import {
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import teamData from '../../data/team.json';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/aboutPage.scss';

const CAPABILITIES = [
  {
    title: 'Websites & Stores',
    body: 'Marketing sites, landing pages, and product-first e-commerce, built custom, never from a template. Shopify, WooCommerce, custom.',
  },
  {
    title: 'Apps & Dashboards',
    body: 'Web apps, client portals, and internal tools built with React and Node: the interfaces that run your business.',
  },
  {
    title: 'AI & Automation',
    body: 'Assistants trained on your business, agents that do real work, and n8n / Zapier / GoHighLevel workflows, self-hosted on your own infrastructure when it matters.',
  },
];

const VALUES = [
  {
    label: 'Blank canvas',
    desc: 'Every project starts from a blank canvas. No themes, no page builders, no shortcuts.',
  },
  {
    label: 'Fast delivery',
    desc: 'Landing pages and first automations ship in days, full sites in weeks, never at the cost of quality.',
  },
  {
    label: 'Direct collaboration',
    desc: 'You work with the people actually building your project, not an account manager.',
  },
  {
    label: 'Conversion-focused',
    desc: 'Design follows function. The brief is always a business result.',
  },
  {
    label: 'AI without the hype',
    desc: 'We use AI where it measurably pays off, and tell you when it doesn’t. Engineers first, evangelists never.',
  },
  {
    label: 'Our own stack, self-hosted',
    desc: 'We run our own servers and host our own AI agents. Your systems get the same treatment: no black boxes, no lock-in.',
  },
];

// Entries missing name or role are skipped; empty file hides the section.
const TEAM = teamData.filter((p) => p.name && p.role);

// Merges with the Organization in index.html via the shared @id, adding the
// team as Person members (sameAs from whichever profile links exist).
const teamJsonLd = TEAM.length
  ? {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://switchcasestudio.com/#org',
      member: TEAM.map((p) => ({
        '@type': 'Person',
        name: p.name,
        jobTitle: p.role,
        ...(p.bio ? { description: p.bio } : {}),
        sameAs: [p.linkedin, p.github, p.website].filter(Boolean),
      })),
    }
  : undefined;

const AboutPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);
  /* LC-26a: header is GSAP-revealed (static HTML ships visible) — see
   * usePageHeaderReveal. motion still owns the story/values/team blocks. */
  const heroRef = useRef(null);
  usePageHeaderReveal(heroRef);

  return (
    <>
      <Seo
        title="About | Switch Case Studio"
        description="The engineer-led studio behind conversion-focused websites, apps, and AI systems. Design, code, and automation by the people who build it: personal attention, no templates, no hype."
        path="/about"
        jsonLd={teamJsonLd}
      />

      <article className="about-page" aria-label="About Switch Case Studio">
        {/* ── Hero ── */}
        <header className="about-page__hero" ref={heroRef}>
          <p className="about-page__kicker page-head-animate">
            Our Studio
          </p>
          <h1 className="about-page__title page-head-animate">
            Design-led.
            <br />
            <span className="about-page__title--accent">AI-native. Results-driven.</span>
          </h1>
          <p className="about-page__lede page-head-animate">
            Switch Case Studio is an engineer-led studio building websites,
            web apps, and AI systems for businesses that want
            the AI revolution working for them, not marketed at them.
          </p>
        </header>

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
                We're a small, focused studio, which means every project gets
                personal attention from the people actually building it. Our
                clients include medical spas, real estate firms, e-commerce
                brands, and marketing companies across the US.
              </p>
              <p>
                We move fast without cutting corners: landing pages and first
                automations ship in days, full sites in a few weeks, with a
                design-to-launch process that keeps you in the loop without
                drowning you in it. Whatever the build, the people who design it
                are the people who measure it after launch.
              </p>
              <p>
                And we practice what we sell: our own studio runs on the
                automations we build for clients: self-hosted n8n workflows,
                AI agents on our own servers, and assistants built on Claude
                and OpenAI. When we recommend a system, it's because we run it.
              </p>
            </div>
            <div className="about-page__stat-col">
              <div className="about-page__stat">
                <span className="about-page__stat-value">19+</span>
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

        {/* ── Team ── */}
        {TEAM.length > 0 && (
          <section className="about-page__team" aria-labelledby="about-team-heading">
            <div className="about-page__section-wrap">
              <h2 id="about-team-heading" className="about-page__section-label">
                The Team
              </h2>
              <motion.div
                className="about-page__team-grid"
                variants={v(containerVariants)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {TEAM.map((p) => (
                  <motion.div
                    key={p.name}
                    className="about-page__person"
                    variants={v(cardVariants)}
                  >
                    {p.photo ? (
                      <img
                        className="about-page__person-photo"
                        src={p.photo}
                        alt={p.photoAlt || p.name}
                        loading="lazy"
                        width="96"
                        height="96"
                      />
                    ) : (
                      <div className="about-page__person-monogram" aria-hidden="true">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="about-page__person-name">{p.name}</h3>
                    <p className="about-page__person-role">{p.role}</p>
                    {p.bio && <p className="about-page__person-bio">{p.bio}</p>}
                    {(p.linkedin || p.github || p.website) && (
                      <p className="about-page__person-links">
                        {p.linkedin && (
                          <a
                            href={p.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${p.name} on LinkedIn`}
                          >
                            LinkedIn ↗
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${p.name} on GitHub`}
                          >
                            GitHub ↗
                          </a>
                        )}
                        {p.website && (
                          <a
                            href={p.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${p.name}'s website`}
                          >
                            Site ↗
                          </a>
                        )}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

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
            <BookCallCta className="about-page__cta-btn about-page__cta-btn--primary" />
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
