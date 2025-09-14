import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useScrollLock from '../hooks/useScrollLock';
import ProjectDetails from './ProjectDetails';
import ProjectsHeader from './ProjectsHeader';
import ProjectsInfoRow from './ProjectsInfoRow';
import ProjectsTiles from './ProjectsTiles';

import projectsData from '../data/projects.json';
import '../styles/components/projects.scss';

const BASE_PROJECTS = [
  { id: 1, label: 'Zahav Medspa', panelClass: 'panel-hero' },
  { id: 2, label: 'ProDani Miami', panelClass: 'panel-card-1' },
  { id: 3, label: 'PROJECT B', panelClass: 'panel-card-2' },
  { id: 4, label: 'PROJECT C', panelClass: 'panel-card-3' },
];

const PROJECTS = BASE_PROJECTS.map((p) => ({
  ...p,
  ...(projectsData.find((d) => d.id === p.id) || {}),
}));

const Projects = () => {
  const [openId, setOpenId] = useState(null);
  useScrollLock(Boolean(openId));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = PROJECTS.find((p) => p.id === openId);

  return (
    <section className="projects" id="projects" aria-label="project overview">
      <ProjectsHeader />
      <ProjectsInfoRow />
      <ProjectsTiles projects={PROJECTS.slice(0, 4)} onOpen={setOpenId} />

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
              onClick={() => setOpenId(null)}
            />
            <ProjectDetails project={active} onClose={() => setOpenId(null)} />
          </div>,
          document.body
        )}
    </section>
  );
};

export default Projects;
