import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Seo from '../util/Seo';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import armSafetyNet from '../../animation/armSafetyNet';
import Polaroids from '../sections/Polaroids';
import BookCallCta from '../ui/BookCallCta';
import teamData from '../../data/team.json';
import posts from '../../data/posts.json';
import projects from '../../data/projects.json';
import '../../styles/components/aboutPage.scss';

gsap.registerPlugin(ScrollTrigger);

/* About page, redesigned 2026-09-13 (owner: "long, outdated, not clear,
   boring"). Opens on the crew (the polaroid table); the statue hero,
   services, places and client strip were cut on review (owner, same day).
   Every number on this page is DERIVED from projects.json metrics, which
   are sourced in their case studies; nothing is typed here. */

const PRINCIPLES = [
  {
    title: 'A blank canvas, every time',
    body: 'No themes, no page builders. Every layout, line of copy and line of code is made for your business.',
  },
  {
    title: 'You talk to the builder',
    body: 'The people designing and coding your project are the people on your calls. No account manager in between.',
  },
  {
    title: 'AI where it pays',
    body: 'We use AI where it measurably earns its place, and tell you when it doesn’t. Engineers first, evangelists never.',
  },
  {
    title: 'Measured after launch',
    body: 'Launch is the midpoint. We measure speed, search and conversions against where you started, and publish the numbers.',
  },
];

const STEPS = [
  { title: 'Call', body: 'A strategy call about your goals, your customers and what the site or system has to do.' },
  { title: 'Plan', body: 'A written scope, priced from our published tiers, before any work starts.' },
  { title: 'Design', body: 'Layouts and brand built on your real content, reviewed with you before code.' },
  { title: 'Build', body: 'Hand-written code with the AI and automations wired in, checked at phone and desktop sizes.' },
  { title: 'Launch + measure', body: 'We ship, then measure speed, search and conversions and report what changed.' },
];

const BUILD_WITH = ['Next.js', 'React', 'Node', 'Shopify', 'Python', '.NET'];
const RUN_OURSELVES = [
  'Self-hosted n8n workflows',
  'AI agents on Hermes and OpenClaw',
  'Assistants on Claude and OpenAI',
  'CRM pipelines and our own servers',
];

// [slug, metric index]: the figure is read from projects.json, so it can't
// drift from the case study that sources it.
const PROOF = [
  ['florida-green-improvements', 0],
  ['renewed-bodyworks', 2],
  ['prodani-miami', 0],
  ['zahav-medspa', 3],
]
  .map(([slug, i]) => {
    const p = projects.find((x) => x.slug === slug);
    const m = p?.metrics?.[i];
    return p && m ? { slug, title: p.title, value: m.value, label: m.label } : null;
  })
  .filter(Boolean);

// Timings quoted in the process section, also read from projects.json.
const timing = (slug) => {
  const p = projects.find((x) => x.slug === slug);
  const m = p?.metrics?.find((x) => /to live/i.test(x.label));
  return p && m ? { slug, title: p.title, value: m.value } : null;
};
const TIMINGS = ['crimson-equities', 'jo-marketing-11', 'florida-energy-assistance'].map(timing).filter(Boolean);

// Entries missing name or role are skipped.
const TEAM = teamData.filter((p) => p.name && p.role);

// Merges with the Organization in index.html via the shared @id.
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

/* Scroll reveals, house safe-reveal pattern: static HTML ships visible, the
   hidden state is set at runtime only, anything already on screen stands,
   and armSafetyNet forces an on-screen element visible if its trigger never
   fires. Reduced motion never hides anything. */
const useReveals = (rootRef, reduced) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    const disarms = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ap-reveal', root).forEach((el) => {
        if (ScrollTrigger.isInViewport(el, 0.05)) return;
        gsap.set(el, { autoAlpha: 0, y: 28 });
        const reveal = () =>
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: reveal });
        disarms.push(
          armSafetyNet(
            el,
            () => gsap.getProperty(el, 'opacity') >= 1 || gsap.isTweening(el),
            () => gsap.set(el, { autoAlpha: 1, y: 0 }),
          ),
        );
      });
    }, root);
    return () => {
      disarms.forEach((d) => d && d());
      ctx.revert();
    };
  }, [rootRef, reduced]);
};

const SectionHead = ({ id, kicker, title }) => (
  <header className="ap-head ap-reveal">
    <p className="ap-head__kicker">{kicker}</p>
    <h2 id={id} className="ap-head__title">
      {title}
    </h2>
  </header>
);

const AboutPage = () => {
  const reduced = useReducedMotion();
  const headRef = useRef(null);
  const rootRef = useRef(null);
  // Once per page (module-level latches, CLAUDE.md): the page head only.
  usePageHeaderReveal(headRef);
  useReveals(rootRef, reduced);
  const post = posts[0];

  return (
    <>
      <Seo
        title="About | Switch Case Studio"
        description="An engineer-led studio in Portland, Oregon. Websites, web apps and AI systems, designed, built and measured by the people you talk to."
        path="/about"
        jsonLd={teamJsonLd}
      />

      <article className="about-page" ref={rootRef} aria-label="About Switch Case Studio">
        {/* ── Crew: the page opens here ── */}
        <section className="ap-section ap-crew" aria-labelledby="ap-crew">
          <div className="ap-wrap">
            {/* The page head: first screen, so it's GSAP-revealed from the
                static HTML (usePageHeaderReveal), not a scroll reveal. */}
            <header className="ap-head" ref={headRef}>
              <p className="ap-head__kicker page-head-animate">The crew</p>
              <h1 id="ap-crew" className="ap-head__title page-head-animate">
                The people behind the work.
              </h1>
            </header>
          </div>
          <div className="ap-crew__table">
            <Polaroids />
          </div>
          {TEAM.length > 0 && (
            <ul className="ap-wrap ap-crew__list">
              {TEAM.map((p) => (
                <li key={p.name} className="ap-person ap-reveal">
                  {p.photo && (
                    <img
                      className="ap-person__photo"
                      src={p.photo}
                      alt={p.photoAlt || p.name}
                      loading="lazy"
                      width="72"
                      height="72"
                    />
                  )}
                  <h3 className="ap-person__name">{p.name}</h3>
                  <p className="ap-person__role">{p.role}</p>
                  {p.bio && <p className="ap-person__bio">{p.bio}</p>}
                  {(p.linkedin || p.github || p.website) && (
                    <p className="ap-person__links">
                      {p.linkedin && (
                        <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>
                          LinkedIn
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub`}>
                          GitHub
                        </a>
                      )}
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}'s website`}>
                          Site
                        </a>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Principles ── */}
        <section className="ap-section" aria-labelledby="ap-principles">
          <div className="ap-wrap">
            <SectionHead id="ap-principles" kicker="How we work" title="Four rules we don’t bend." />
            <ol className="ap-rules">
              {PRINCIPLES.map((r, i) => (
                <li key={r.title} className="ap-rule ap-reveal">
                  <span className="ap-rule__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="ap-rule__title">{r.title}</h3>
                  <p className="ap-rule__body">{r.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="ap-section" aria-labelledby="ap-process">
          <div className="ap-wrap">
            <SectionHead id="ap-process" kicker="The process" title="From first call to measured results." />
            <ol className="ap-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="ap-step ap-reveal">
                  <span className="ap-step__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="ap-step__title">{s.title}</h3>
                  <p className="ap-step__body">{s.body}</p>
                </li>
              ))}
            </ol>
            {TIMINGS.length > 0 && (
              <p className="ap-steps__timing ap-reveal">
                How long it takes, from our own case studies:{' '}
                {TIMINGS.map((t, i) => (
                  <span key={t.slug}>
                    <Link to={`/projects/${t.slug}`}>{t.title}</Link>, {t.value.replace(/\s+/g, ' ')}
                    {i < TIMINGS.length - 1 ? ' · ' : '.'}
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>

        {/* ── Stack ── */}
        <section className="ap-section" aria-labelledby="ap-stack">
          <div className="ap-wrap ap-stack">
            <SectionHead id="ap-stack" kicker="Our stack" title="We run what we sell." />
            <div className="ap-stack__cols">
              <div className="ap-stack__col ap-reveal">
                <h3 className="ap-stack__label">We build with</h3>
                <ul className="ap-stack__chips">
                  {BUILD_WITH.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="ap-stack__col ap-reveal">
                <h3 className="ap-stack__label">We run for ourselves</h3>
                <ul className="ap-stack__list">
                  {RUN_OURSELVES.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="ap-stack__note">
                  When we recommend a system, it’s because the studio already runs on it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Proof ── */}
        <section className="ap-section" aria-labelledby="ap-proof">
          <div className="ap-wrap">
            <SectionHead id="ap-proof" kicker="Numbers you can check" title="Measured, sourced, linked." />
            <ul className="ap-metrics">
              {PROOF.map((m) => (
                <li key={m.slug} className="ap-metric ap-reveal">
                  <Link to={`/projects/${m.slug}`}>
                    <span className="ap-metric__value">{m.value}</span>
                    <span className="ap-metric__label">{m.label}</span>
                    <span className="ap-metric__who">{m.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Journal + CTA ── */}
        <section className="ap-section ap-end" aria-labelledby="ap-cta">
          <div className="ap-wrap ap-end__grid">
            {post && (
              <aside className="ap-journal ap-reveal" aria-labelledby="ap-journal-title">
                <p className="ap-head__kicker">From the journal</p>
                <h3 id="ap-journal-title" className="ap-journal__title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="ap-journal__excerpt">{post.excerpt}</p>
                <Link to="/blog" className="ap-journal__all">
                  All posts
                </Link>
              </aside>
            )}
            <div className="ap-cta ap-reveal">
              <h2 id="ap-cta" className="ap-cta__title">
                Let’s bring your idea to life.
              </h2>
              <div className="ap-cta__actions">
                <BookCallCta className="ap-btn" />
                <Link to="/projects" className="ap-btn ap-btn--ghost">
                  See the work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
};

export default AboutPage;
