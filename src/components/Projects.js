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

/* ── Static lookups ── */
const findById = (id) => projectsData.find((p) => p.id === id);
const findBySlug = (s) => projectsData.find((p) => p.slug === s);

const Projects = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [openId, setOpenId] = useState(null);
  const reduced = useReducedMotion();
  const root = useRef(null);
  const headerWrapRef = useRef(null);

  useScrollLock(Boolean(openId));

  /* ── Sync URL slug → open state ── */
  useEffect(() => {
    if (!slug) {
      setOpenId(null);
      return;
    }
    const match = findBySlug(slug);
    if (match) setOpenId(match.id);
  }, [slug]);

  /* ── Modal controls ── */
  const closeModal = useCallback(
    (target = '/') => {
      setOpenId(null);
      navigate(target, { replace: true, state: { preserveScroll: true } });
    },
    [navigate],
  );

  const openProject = useCallback(
    (id) => {
      const proj = findById(id);
      if (proj?.slug) {
        sessionStorage.setItem('scrollPosition', String(window.scrollY));
        navigate(`/projects/${proj.slug}`, {
          state: { preserveScroll: true },
        });
      } else {
        setOpenId(id);
      }
    },
    [navigate],
  );

  /* ── Escape key ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  /* ── GSAP scroll-triggered entrance ── */
  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Header letter reveal
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

      // Tile grid reveal
      gsap.from('.row-tiles', {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.row-tiles',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, root);

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
        onOpen={openProject}
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
              onClick={() => closeModal()}
            />
            <ProjectDetails
              project={activeProject}
              onClose={() => closeModal()}
              onBack={() => closeModal('/#projects')}
            />
          </div>,
          document.body,
        )}
    </section>
  );
};

export default Projects;
