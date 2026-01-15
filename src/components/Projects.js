import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'; // 1. Added useCallback
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useScrollLock from '../hooks/useScrollLock';
import useReducedMotion from '../hooks/useReducedMotion';

import ProjectDetails from './ProjectDetails';
import ProjectsHeader from './ProjectsHeader';
import ProjectsInfoRow from './ProjectsInfoRow';
import ProjectsTiles from './ProjectsTiles';

import projectsData from '../data/projects.json';
import '../styles/components/projects.scss';

gsap.registerPlugin(ScrollTrigger);

const BASE_PROJECTS = [
  {
    id: 1,
    label: 'Zahav Medspa',
    panelClass: 'panel-hero',
    slug: 'zahav-medspa',
  },
  {
    id: 2,
    label: 'ProDani Miami',
    panelClass: 'panel-card-1',
    slug: 'prodani-miami',
  },
  {
    id: 3,
    label: 'creatuwheels',
    panelClass: 'panel-card-2',
    slug: 'creatuwheels',
  },
  { id: 4, label: 'Maritime', panelClass: 'panel-card-3', slug: 'maritime' },
];

const PROJECTS = BASE_PROJECTS.map((p) => ({
  ...p,
  ...(projectsData.find((d) => d.id === p.id) || {}),
}));

const Projects = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [openId, setOpenId] = useState(null);

  useScrollLock(Boolean(openId));
  const reduced = useReducedMotion();
  const root = useRef(null);

  const findById = (id) => PROJECTS.find((p) => p.id === id);
  const findBySlug = (s) => PROJECTS.find((p) => p.slug === s);

  // Sync URL slug with internal state
  useEffect(() => {
    if (!slug) {
      setOpenId(null);
      return;
    }
    const match = findBySlug(slug);
    setOpenId(match ? match.id : null);
  }, [slug]);

  // --- 2. DEFINED CLOSE FUNCTION FIRST (WRAPPED IN USECALLBACK) ---
  const closePlain = useCallback(() => {
    setOpenId(null);
    navigate('/', {
      replace: true,
      state: { preserveScroll: true },
    });
  }, [navigate]);

  // --- 3. NOW USE IT IN THE EFFECT ---
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closePlain();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePlain]); // <--- No more warning

  const active = findById(openId);

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
      gsap.utils.toArray('.projects .projects-row').forEach((row, i) => {
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

  return (
    <section
      className="projects"
      id="projects"
      aria-label="project overview"
      ref={root}
    >
      <ProjectsInfoRow />
      <ProjectsHeader />

      <ProjectsTiles
        projects={PROJECTS.slice(0, 4)}
        onOpen={openById}
        modalOpen={Boolean(active)}
      />

      {active &&
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
              project={active}
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