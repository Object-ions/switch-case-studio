import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import { motion, useReducedMotion } from 'motion/react';
import projectsData from '../../data/projects.json';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import {
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/projectsPage.scss';

const MotionLink = motion.create(Link);

/* One card. The website preview (the tall long.webp) shows IN the card on
 * hover, the same behaviour as the home grid tiles (2026-09-03, owner call:
 * the floating HoverPeek window next to the card is gone). Mounted on FIRST
 * hover, never eagerly: ten screenshots would be ~5MB on page load. `loaded`
 * gates the fade so the cover never swaps to a half-painted screenshot. */
const ProjectCard = ({ project, reduced, variants }) => {
  const [warm, setWarm] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const hasPeek = !!project.longWeb;

  return (
    <MotionLink
      to={`/projects/${project.slug}`}
      className={`projects-page__card${hasPeek ? ' has-peek' : ''}`}
      aria-label={`View case study: ${project.title}`}
      variants={variants}
      onMouseEnter={hasPeek ? () => setWarm(true) : undefined}
      whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25 } }}
      whileTap={reduced ? undefined : { scale: 0.97, transition: { duration: 0.15 } }}
    >
      <div className="projects-page__card-img">
        {project.badge && (
          <span className="projects-page__card-badge">{project.badge}</span>
        )}
        <img
          src={project.coverTile}
          alt={project.imageAlt || project.title}
          loading="lazy"
        />
        {hasPeek && warm && (
          <img
            className={`projects-page__card-peek${loaded ? ' is-loaded' : ''}`}
            src={project.longWeb}
            alt=""
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
      <div className="projects-page__card-body">
        <div className="projects-page__card-meta">
          {project.year && (
            <span className="projects-page__card-year">{project.year}</span>
          )}
          {project.kicker && (
            <span className="projects-page__card-kicker">{project.kicker}</span>
          )}
          {/* Disclosure: self-initiated work sitting in a grid of paid
              client projects reads as client work unless it says
              otherwise. In flow, never a corner chip — the absolutely
              positioned tile badge already broke once at the mobile
              breakpoint. */}
          {project.studioProject && (
            <span className="projects-page__card-studio">
              Studio project
            </span>
          )}
        </div>
        <h2 className="projects-page__card-title">{project.title}</h2>
        {project.subtitle && (
          <p className="projects-page__card-sub">{project.subtitle}</p>
        )}
        {project.services?.length > 0 && (
          <ul className="projects-page__card-tags" aria-label="Services">
            {project.services.slice(0, 3).map((s) => (
              <li key={s.label} className="projects-page__card-tag">
                {s.label.replace(/^#/, '')}
              </li>
            ))}
          </ul>
        )}
        <span className="projects-page__card-cta" aria-hidden="true">
          View case study →
        </span>
      </div>

    </MotionLink>
  );
};

const CaseStudiesPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);
  /* LC-26c: header is GSAP-revealed (static HTML ships visible) — see
   * usePageHeaderReveal. motion still owns the grid + CTA below. */
  const headerRef = useRef(null);
  usePageHeaderReveal(headerRef);

  return (
    <>
      <Seo
        title="Case Studies | Switch Case Studio"
        description="Browse Switch Case Studio's portfolio: landing pages, websites, e-commerce stores, and apps built for clients across the US."
        path="/projects"
      />

      <article className="projects-page" aria-label="Case studies">
        {/* ── Header ── */}
        <header className="projects-page__header" ref={headerRef}>
          <p className="projects-page__kicker page-head-animate">
            Portfolio
          </p>
          <h1 className="projects-page__title page-head-animate">
            Selected Work
          </h1>
          <p className="projects-page__lede page-head-animate">
            {projectsData.length} projects. All built from scratch.
          </p>
        </header>

        {/* ── Grid ──
            Reveal on MOUNT (animate), not on scroll (whileInView). The grid
            is the page's primary content and sits in the first viewport under
            a short header — but it's a very tall section, so a scroll-based
            `amount` threshold is never met on load (esp. single-column
            mobile), stranding every card at opacity:0 until you scroll. The
            staggered cascade still plays on load; cards keep their hover. */}
        <motion.section
          className="projects-page__grid"
          aria-label="Project list"
          variants={v(containerVariants)}
          initial="hidden"
          animate="visible"
        >
          {projectsData.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              reduced={reduced}
              variants={v(cardVariants)}
            />
          ))}
        </motion.section>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="projects-page__bottom"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="projects-page__bottom-text">
            Want to see what we can build for you?
          </p>
          <BookCallCta className="projects-page__bottom-btn" />
        </motion.div>
      </article>
    </>
  );
};

export default CaseStudiesPage;
