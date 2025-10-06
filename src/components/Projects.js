import { useState, useEffect, useLayoutEffect, useRef } from 'react';
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

// Give each base project a stable slug
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
  const reduced = useReducedMotion();
  useScrollLock(Boolean(openId));

  const root = useRef(null);

  const findById = (id) => PROJECTS.find((p) => p.id === id);
  const findBySlug = (s) => PROJECTS.find((p) => p.slug === s);

  useEffect(() => {
    if (!slug) {
      setOpenId(null);
      return;
    }
    const match = findBySlug(slug);
    setOpenId(match ? match.id : null);
  }, [slug]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenId(null);
        navigate('/', { replace: true, state: { preserveScroll: true } });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const active = findById(openId);

  const openById = (id) => {
    const proj = findById(id);
    if (proj?.slug) {
      navigate(`/projects/${proj.slug}`, {
        state: { from: 'projects-section' },
      });
    } else {
      setOpenId(id);
    }
  };

  // X / ESC / backdrop → close and return to root (no hash)
  const closePlain = () => {
    // remember current scroll position for one navigation
    try {
      sessionStorage.setItem('preserveScroll', '1');
      sessionStorage.setItem('preserveScrollY', String(window.scrollY));
    } catch {}
    setOpenId(null);
    navigate('/', { replace: true, state: { preserveScroll: true } });
  };

  // “Back to Projects” → close and jump to the section
  const closeToProjects = () => {
    setOpenId(null);
    navigate('/#projects', { replace: true });
  };

  // Section-level animations
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Fade/slide in each row as it enters
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
              onClick={closePlain} // <- close overlay, go to "/"
            />
            <ProjectDetails
              project={active}
              onClose={closePlain} // <- X button / ESC / backdrop
              onBack={closeToProjects} // <- “Back to Projects”
            />
          </div>,
          document.body
        )}
    </section>
  );
};

export default Projects;
