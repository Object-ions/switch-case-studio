// Projects.js
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useScrollLock from '../hooks/useScrollLock';
import useReducedMotion from '../hooks/useReducedMotion';

import ProjectDetails from './ProjectDetails';
import ProjectsHeader from './ProjectsHeader';
import ProjectsTiles from './ProjectsTiles';

import projectsData from '../data/projects.json';
import '../styles/components/projects.scss';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [openId, setOpenId] = useState(null);

  useScrollLock(Boolean(openId));
  const reduced = useReducedMotion();
  const root = useRef(null);

  // IMPORTANT: this ref must wrap the header letters
  const headerWrapRef = useRef(null);

  const findById = (id) => projectsData.find((p) => p.id === id);
  const findBySlug = (s) => projectsData.find((p) => p.slug === s);

  useEffect(() => {
    if (!slug) {
      setOpenId(null);
      return;
    }
    const match = findBySlug(slug);
    if (match) setOpenId(match.id);
  }, [slug]);

  const closePlain = useCallback(() => {
    setOpenId(null);
    navigate('/', {
      replace: true,
      state: { preserveScroll: true },
    });
  }, [navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closePlain();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePlain]);

  const openById = (id) => {
    const proj = findById(id);
    if (proj?.slug) {
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

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Reveal the header (new component)
      gsap.from('.projects-header-wrap .variable-proximity-demo span', {
        autoAlpha: 0,
        y: 14,
        duration: 0.6,
        stagger: 0.012,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-header-wrap',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // Reveal each row (existing behavior)
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

    // Helps when layout/fonts affect measurements
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [reduced]);

  const activeProject = findById(openId);

  return (
    <section
      className="projects"
      id="projects"
      aria-label="project overview"
      ref={root}
    >
      <div ref={headerWrapRef} className="projects-header-wrap">
        <ProjectsHeader
          label="A Selection of Projects and Case Studies"
          className="variable-proximity-demo"
          fromFontVariationSettings="'wght' 300, 'opsz' 8"
          toFontVariationSettings="'wght' 1000, 'opsz' 72"
          containerRef={headerWrapRef}
          radius={140}
          falloff="gaussian"
        />
      </div>

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
          document.body,
        )}
    </section>
  );
};

export default Projects;
