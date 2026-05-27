import projects from './projects.json';

export const PRICING_LINKS = [
  { label: 'Web Development', to: '/pricing/web-development' },
  { label: 'Growth & Performance', to: '/pricing/marketing-ads' },
  { label: 'Hosting & Support', to: '/pricing/hosting-maintenance' },
  { label: 'Brand Identity', to: '/pricing/design-branding' },
  { label: 'Automation & Systems', to: '/pricing/automation-integrations' },
  { label: 'Email & Retention', to: '/pricing/email-marketing' },
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