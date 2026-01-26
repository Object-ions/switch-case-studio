import projects from './projects.json';

export const PRICING_LINKS = [
  { label: 'Web Development', to: '/pricing/web-development' },
  { label: 'Marketing & Advertisement', to: '/pricing/marketing-ads' },
  { label: 'Web Hosting & Maintenance', to: '/pricing/hosting-maintenance' },
  { label: 'Design & Branding', to: '/pricing/design-branding' },
  { label: 'Automation & Integrations', to: '/pricing/automation-integrations' },
  { label: 'Email Marketing', to: '/pricing/email-marketing' },
];

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