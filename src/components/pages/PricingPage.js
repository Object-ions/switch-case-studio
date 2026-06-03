import { Link, Navigate, useParams } from 'react-router-dom';
import pricingData from '../../data/pricingData.json';
import { PricingGuide } from './PricingGuide';

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
  { slug: 'marketing-ads', label: 'Growth & Performance' },
  { slug: 'hosting-maintenance', label: 'Hosting & Support' },
  { slug: 'design-branding', label: 'Brand Identity' },
  { slug: 'automation-integrations', label: 'Automation & Systems' },
  { slug: 'email-marketing', label: 'Email & Retention' },
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

  return <PricingGuide serviceId={serviceId} />;
}

export default PricingPage;
