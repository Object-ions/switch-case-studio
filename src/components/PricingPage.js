import { Link, Navigate, useParams } from 'react-router-dom';
import pricingData from '../data/pricingData.json';
import { PricingGuide } from './PricingGuide';
import glitchEffect from '../assets/videos/glitch-effect.mp4';

const slugToServiceId = {
  'web-development': 'web-development',
  'marketing-ads': 'marketing-advertisement',
  'hosting-maintenance': 'web-hosting-maintenance',
  'design-branding': 'design-branding',
  'automation-integrations': 'automation-integrations',
  'email-marketing': 'email-marketing',
};

const servicesIndex = [
  { slug: 'web-development', label: 'Web Development' },
  { slug: 'marketing-ads', label: 'Marketing & Advertisement' },
  { slug: 'hosting-maintenance', label: 'Web Hosting & Maintenance' },
  { slug: 'design-branding', label: 'Design & Branding' },
  { slug: 'automation-integrations', label: 'Automation & Integrations' },
  { slug: 'email-marketing', label: 'Email Marketing' },
];

function PricingPage() {
  const { serviceSlug } = useParams();

  // Overview (no slug)
  if (!serviceSlug) {
    return (
      <section className="pricing-overview">
        <h1 className="sr-only">Pricing</h1>
        <ul className="pricing-overview__list">
          {servicesIndex.map((s) => (
            <li key={s.slug}>
              <Link
                className="pricing-overview__link"
                to={`/pricing/${s.slug}`}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Resolve slug → service id
  const serviceId = slugToServiceId[serviceSlug];
  if (!serviceId) return <Navigate to="/pricing" replace />;

  const exists = pricingData.services.some((s) => s.id === serviceId);
  if (!exists) return <Navigate to="/pricing" replace />;

  return <PricingGuide serviceId={serviceId} heroSrc={glitchEffect} />;
}

export default PricingPage;
