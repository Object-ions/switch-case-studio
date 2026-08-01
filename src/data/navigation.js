import projects from './projects.json';
import services from './services.json';

// Derived from services.json (like PROJECT_LINKS below) — title, slug, and
// ORDER all come from the data file, so a service rename/add/reorder can't
// drift here. Consumers: Header dropdown, StaggeredMenu, Footer.
export const PRICING_LINKS = services.map((service) => ({
  label: service.title,
  to: `/pricing/${service.slug}`,
}));

// Dynamically generate project links based on the slugs in projects.json
export const PROJECT_LINKS = projects.map((project) => ({
  label: project.title,
  to: `/projects/${project.slug}`,
}));

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Accessibility Statement', to: '/accessibility' },
];