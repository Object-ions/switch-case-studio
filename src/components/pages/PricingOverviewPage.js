import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import servicesData from '../../data/services.json';
import '../../styles/components/pricingOverviewPage.scss';

const PricingOverviewPage = () => {

  return (
    <>
      <Helmet>
        <title>Services & Pricing — Switch Case Studio</title>
        <meta
          name="description"
          content="Explore Switch Case Studio's services — web development, e-commerce, design & branding, marketing, automation, and more. Transparent pricing, fast delivery."
        />
        <link rel="canonical" href="https://switchcasestudio.com/pricing" />
        <meta property="og:title" content="Services & Pricing — Switch Case Studio" />
        <meta
          property="og:description"
          content="Explore our services — web development, e-commerce, design, marketing, and automation. Transparent pricing, fast delivery."
        />
      </Helmet>

      <article className="pop-page" aria-label="Services and pricing">
        {/* ── Header ── */}
        <header className="pop-page__header">
          <p className="pop-page__kicker">Services</p>
          <h1 className="pop-page__title">
            What we do,
            <br />
            <span className="pop-page__title--accent">and what it costs.</span>
          </h1>
          <p className="pop-page__lede">
            Pick a service to see the full breakdown — scope, deliverables,
            and transparent pricing.
          </p>
        </header>

        {/* ── Services grid ── */}
        <section className="pop-page__grid" aria-label="Service list">
          {servicesData.map((service) => (
            <Link
              key={service.slug}
              to={`/pricing/${service.slug}`}
              className="pop-page__card"
              aria-label={`View pricing for ${service.title}`}
            >
              <div className="pop-page__card-head">
                <h2 className="pop-page__card-title">{service.title}</h2>
                <p className="pop-page__card-sub">{service.subTitle}</p>
              </div>

              <p className="pop-page__card-desc">{service.description}</p>

              {service.items?.length > 0 && (
                <ul className="pop-page__card-items" aria-label="Included">
                  {service.items.map((item) => (
                    <li key={item} className="pop-page__card-item">
                      <span className="pop-page__card-item-dot" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <span className="pop-page__card-cta" aria-hidden="true">
                See pricing →
              </span>
            </Link>
          ))}
        </section>

        {/* ── Bottom CTA ── */}
        <div className="pop-page__bottom">
          <h2 className="pop-page__bottom-heading">Not sure which service you need?</h2>
          <p className="pop-page__bottom-body">
            Book a free call — we'll figure it out together.
          </p>
          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            target="_blank"
            rel="noopener noreferrer"
            className="pop-page__bottom-btn"
          >
            Book a Free Call
          </a>
        </div>
      </article>
    </>
  );
};

export default PricingOverviewPage;
