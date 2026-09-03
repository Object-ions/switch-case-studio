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

// The footer's "Explore" column. Lived in Footer.js as a component-local array
// until 2026-08-05 — the same shape that let the service names drift there once
// already. Any new top-level route gets added HERE, not in a component.
// `hash` entries scroll a section on the current page; `to` entries are routes.
export const EXPLORE_LINKS = [
  { label: 'Services', hash: '#services' },
  { label: 'About', to: '/about' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', hash: '#contact' },
];

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Accessibility Statement', to: '/accessibility' },
];