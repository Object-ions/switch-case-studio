import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useScrollLock from '../hooks/useScrollLock';
import useReducedMotion from '../hooks/useReducedMotion';

import ProjectDetails from './ProjectDetails';
import ProjectsHeader from './ProjectsHeader';
import ProjectsTiles from './ProjectsTiles';

// Now we import the full data directly
import projectsData from '../data/projects.json';
import '../styles/components/projects.scss';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // State for the active project ID (modal)
  const [openId, setOpenId] = useState(null);

  useScrollLock(Boolean(openId));
  const reduced = useReducedMotion();
  const root = useRef(null);

  // Helper to find project by ID or Slug
  const findById = (id) => projectsData.find((p) => p.id === id);
  const findBySlug = (s) => projectsData.find((p) => p.slug === s);

  // 1. Sync URL slug with internal state (Deep Linking)
  useEffect(() => {
    if (!slug) {
      setOpenId(null);
      return;
    }
    const match = findBySlug(slug);
    if (match) {
      setOpenId(match.id);
    }
  }, [slug]);

  // 2. Close Modal Handler
  const closePlain = useCallback(() => {
    setOpenId(null);
    navigate('/', {
      replace: true,
      state: { preserveScroll: true },
    });
  }, [navigate]);

  // 3. Handle 'Escape' key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closePlain();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePlain]);

  // 4. Open Project Handler
  const openById = (id) => {
    const proj = findById(id);
    if (proj?.slug) {
      // Save scroll position before navigating
      sessionStorage.setItem('scrollPosition', String(window.scrollY));
      navigate(`/projects/${proj.slug}`, {
        state: { preserveScroll: true },
      });
    } else {
      setOpenId(id);
    }
  };

  const closeToProjects = () => {
    setOpenId(null);
    navigate('/#projects', { replace: true });
  };

  // 5. GSAP Entrance Animation
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.projects-row').forEach((row, i) => {
        gsap.from(row, {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Get the active project object if the modal is open
  const activeProject = findById(openId);

  return (
    <section
      className="projects"
      id="projects"
      aria-label="project overview"
      ref={root}
    >
      <ProjectsHeader />

      <ProjectsTiles
        projects={projectsData}
        onOpen={openById}
        modalOpen={Boolean(activeProject)}
      />

      {activeProject &&
        createPortal(
          <div
            className="project-details-overlay"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="project-details-overlay__backdrop"
              aria-hidden="true"
              onClick={closePlain}
            />
            <ProjectDetails
              project={activeProject}
              onClose={closePlain}
              onBack={closeToProjects}
            />
          </div>,
          document.body
        )}
    </section>
  );
};

export default Projects;