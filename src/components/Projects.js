// Projects.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom'; // NEW
import useScrollLock from '../hooks/useScrollLock';
import ProjectDetails from './ProjectDetails';
import ProjectsHeader from './ProjectsHeader';
import ProjectsInfoRow from './ProjectsInfoRow';
import ProjectsTiles from './ProjectsTiles';

import projectsData from '../data/projects.json';
import '../styles/components/projects.scss';

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
  { id: 3, label: 'PROJECT B', panelClass: 'panel-card-2', slug: 'project-b' },
  { id: 4, label: 'PROJECT C', panelClass: 'panel-card-3', slug: 'project-c' },
];

const PROJECTS = BASE_PROJECTS.map((p) => ({
  ...p,
  ...(projectsData.find((d) => d.id === p.id) || {}),
}));

const Projects = () => {
  const navigate = useNavigate(); // NEW
  const { slug } = useParams(); // NEW
  const [openId, setOpenId] = useState(null);
  useScrollLock(Boolean(openId));

  // Map helpers
  const findById = (id) => PROJECTS.find((p) => p.id === id);
  const findBySlug = (s) => PROJECTS.find((p) => p.slug === s);

  // Open/close via URL
  useEffect(() => {
    if (!slug) {
      setOpenId(null);
      return;
    }
    const match = findBySlug(slug);
    setOpenId(match ? match.id : null);
  }, [slug]);

  // ESC closes and cleans up URL
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenId(null);
        navigate('#projects', { replace: true }); // NEW
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const active = findById(openId);

  // Clicking a tile should push the slug (keeps URL & modal in sync)
  const openById = (id) => {
    const proj = findById(id);
    if (proj?.slug) navigate(`/projects/${proj.slug}`);
    else setOpenId(id); // fallback
  };

  const closeModal = () => {
    setOpenId(null);
    navigate('#projects', { replace: true });
  };

  return (
    <section className="projects" id="projects" aria-label="project overview">
      <ProjectsInfoRow />
      <ProjectsHeader />
      <ProjectsTiles
        projects={PROJECTS.slice(0, 4)}
        onOpen={openById} // UPDATED
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
              onClick={closeModal} // UPDATED
            />
            <ProjectDetails project={active} onClose={closeModal} />{' '}
            {/* UPDATED */}
          </div>,
          document.body
        )}
    </section>
  );
};

export default Projects;
