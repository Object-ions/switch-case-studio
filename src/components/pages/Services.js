import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import {
  faCode,
  faServer,
  faPenNib,
  faWandMagicSparkles,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';

import ScrollingText from '../ScrollingText';
import Bauhaus from '../Bauhous';

import '../../styles/components/services.scss';

const servicesList = [
  {
    icon: faCode,
    title: 'Web Development',
    description:
      'Custom websites and web applications built with modern technologies. From simple landing pages to complex e-commerce platforms.',
    items: [
      'React & Next.js',
      'Node.js Backend',
      'Database Design',
      'API Integration',
      'WordPress & WooCommerce stores',
    ],
  },
  {
    icon: faSearchengin,
    title: 'Marketing & Advertisement',
    description:
      'Maximize your online visibility. Data-driven marketing strategies that grow your business. From SEO to social media, we cover all digital channels.',
    items: [
      'SEO Optimization',
      'Google Ads',
      'Meta Ads',
      'Social Media',
      'Content Strategy',
      'Blog development',
    ],
  },
  {
    icon: faServer,
    title: 'Web Hosting & Maintenance',
    description:
      'Secure, high-performance hosting with optional care plans to keep your site running smoothly.',
    items: [
      'Managed hosting setup',
      'SSL & CDN configuration',
      'Domain setup & DNS management',
      'Custom email domain setup',
      'SPF, DKIM, and DMARC configuration',
    ],
  },
  {
    icon: faPenNib,
    title: 'Design & Branding',
    description:
      'Complete brand development from logo design to brand guidelines. We create identities that stand out in the market.',
    items: [
      'Logo Design',
      'Wireframing',
      'Brand guidelines (color palettes, typography)',
      'Infographics',
      'Visual assets for digital marketing',
    ],
  },
  {
    icon: faWandMagicSparkles,
    title: 'Automation & Integrations',
    description:
      'Automate repetitive tasks and connect your tools for smoother operations. I use tools like Zapier and Go High Level to streamline your business.',
    items: [
      'Custom Zapier workflows',
      'Go High Level automations',
      'Integration with Acuity, Stripe, Mailchimp, and more',
      'Form logic and data routing between apps',
    ],
  },
  {
    icon: faLightbulb,
    title: 'Email Marketing',
    description:
      'Build relationships and increase conversions with targeted, automated email sequences.',
    items: [
      'Welcome flows',
      'Promotional campaigns',
      'Abandoned cart reminders',
      'Monthly newsletters',
    ],
  },
];

const Services = () => {
  return (
    <div id="services">
      <div className="services-hero">
        <div className="title">
          <h1>We</h1>
          <h1>Help</h1>
          <h1>You</h1>
          <h1>Shine</h1>
          <p>In the competitive</p>
          <p>digital landscape</p>
        </div>
        <Bauhaus />
      </div>
      <div className="services-content">
        {servicesList.map((service, index) => (
          <div key={index}>
            <h3>
              <FontAwesomeIcon icon={service.icon} /> {service.title}
            </h3>
            <p>{service.description}</p>
            <ul>
              {service.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ScrollingText />
    </div>
  );
};

export default Services;
