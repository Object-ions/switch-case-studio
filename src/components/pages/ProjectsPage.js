import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'motion/react';
import projectsData from '../../data/projects.json';
import HoverPeek from '../HoverPeek';
import {
  headerVariants,
  lineVariant,
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import '../../styles/components/projectsPage.scss';

const MotionLink = motion.create(Link);

const ProjectsPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);

  return (
    <>
      <Helmet>
        <title>Case Studies — Switch Case Studio</title>
        <meta
          name="description"
          content="Browse Switch Case Studio's portfolio — websites, e-commerce stores, and apps built from scratch for clients across the US."
        />
        <link rel="canonical" href="https://switchcasestudio.com/projects" />
        <meta property="og:title" content="Case Studies — Switch Case Studio" />
        <meta
          property="og:description"
          content="Websites, e-commerce stores, and apps built from scratch for clients across the US."
        />
      </Helmet>

      <article className="projects-page" aria-label="Case studies">
        {/* ── Header ── */}
        <motion.header
          className="projects-page__header"
          variants={v(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className="projects-page__kicker" variants={v(lineVariant)}>
            Portfolio
          </motion.p>
          <motion.h1 className="projects-page__title" variants={v(lineVariant)}>
            Selected Work
          </motion.h1>
          <motion.p className="projects-page__lede" variants={v(lineVariant)}>
            {projectsData.length} projects. All built from scratch.
          </motion.p>
        </motion.header>

        {/* ── Grid ── */}
        <motion.section
          className="projects-page__grid"
          aria-label="Project list"
          variants={v(containerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projectsData.map((project) => (
            <HoverPeek
              key={project.slug}
              imageSrc={project.longWeb}
              alt={`${project.title} — website preview`}
            >
            <MotionLink
              to={`/projects/${project.slug}`}
              className="projects-page__card"
              aria-label={`View case study: ${project.title}`}
              variants={v(cardVariants)}
              whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25 } }}
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
              </div>
              <div className="projects-page__card-body">
                <div className="projects-page__card-meta">
                  {project.year && (
                    <span className="projects-page__card-year">{project.year}</span>
                  )}
                  {project.kicker && (
                    <span className="projects-page__card-kicker">{project.kicker}</span>
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
            </HoverPeek>
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
          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            target="_blank"
            rel="noopener noreferrer"
            className="projects-page__bottom-btn"
          >
            Book a Free Call
          </a>
        </motion.div>
      </article>
    </>
  );
};

export default ProjectsPage;
