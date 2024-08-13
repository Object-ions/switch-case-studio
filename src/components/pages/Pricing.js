import Star from '../../assets/images/star.png';
import gif1 from '../../assets/gifs/1.gif';
import gif2 from '../../assets/gifs/2.gif';
import gif3 from '../../assets/gifs/3.gif';
import gif4 from '../../assets/gifs/4.gif';

import '../../styles/components/pricing.scss';

const Pricing = () => {
  const packages = [
    {
      title: 'Landing Page',
      gif: gif1,
      price: '$800',
      description:
        'Perfect for professional events and promotions. This package offers a sleek, simple one-pager that makes an instant impact. Ideal for events, product launches, or personal branding.',
      includes: [
        'Professional design template',
        'Single responsive page',
        'Engaging slideshow to showcase key information',
        'SEO essentials to increase visibility',
        'Fast load times to keep your audience engaged',
      ],
    },
    {
      title: 'Simple Website',
      gif: gif2,
      price: '$1,500',
      description:
        'Ideal for small businesses and personal portfolios. Expand your digital footprint with a website designed to grow with your needs.',
      includes: [
        'Customizable design template',
        'Up to 5 pages tailored to your content needs',
        'Slideshow to highlight your products or services',
        '1 year of hosting and domain registration',
        'Basic SEO setup for better search engine ranking',
        'Mobile responsiveness for optimal viewing on all devices',
      ],
    },
    {
      title: 'Standard Website',
      gif: gif3,
      price: '$2,500',
      description:
        'Great for growing businesses needing more functionality. A robust website with comprehensive features to facilitate interaction and management.',
      includes: [
        "Custom design to reflect your brand's unique identity",
        'Up to 10 pages of crafted content',
        'Content Management System (CMS) for easy updates',
        'Interactive contact form',
        '1 year of hosting and domain registration',
        'Basic SEO to enhance online presence',
        'Google Analytics integration for visitor insights',
      ],
    },
    {
      title: 'Professional Website',
      gif: gif4,
      price: '$5,000',
      description:
        'A complete solution for e-commerce and complex business needs. For businesses aiming for the top with advanced functionality like e-commerce and detailed user interaction.',
      includes: [
        'Fully custom design tailored to your business requirements',
        'Unlimited pages for comprehensive content delivery',
        'Advanced CMS for full control over content',
        'Detailed contact forms and custom forms',
        'E-commerce functionality, including shopping cart and secure checkout',
        'Database integration for products, users, and admin management',
        '1 year of hosting and domain registration',
        'Advanced SEO practices for superior web presence',
        'Ongoing technical support',
      ],
    },
  ];

  return (
    <div id="pricing">
      <div className="blue-square"></div>
      <div className="star">
        <img src={Star} alt="pricing" />
        <h1>Web Development</h1>
      </div>
      {packages.map((pkg, index) => (
        <div className="package" key={index}>
          <div className="package-image">
            <img src={pkg.gif} alt={pkg.title} />
          </div>
          <div className="package-title-price">
            <p className="package-title">{pkg.title}</p>
            <p className="package-price">{pkg.price}</p>
          </div>
          <div className="package-main">
            <div>
              <p>{pkg.description}</p>
            </div>
            <div className="package-includes">
              <ul>
                {pkg.includes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pricing;
