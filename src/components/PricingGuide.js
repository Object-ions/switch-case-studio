import React, { useMemo } from 'react';
import pricingData from '../data/pricingData.json';

import '../styles/components/pricingGuide.scss';

const formatMoney = (n) =>
  n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

export const PricingGuide = ({ serviceId, heroSrc }) => {
  const service = useMemo(
    () => pricingData.services.find((s) => s.id === serviceId),
    [serviceId]
  );

  if (!service) {
    return (
      <section className={`pricing-guide`}>
        <p className="pg-empty">No pricing found for this service.</p>
      </section>
    );
  }

  return (
    <section className={`pricing-guide`} aria-labelledby="pg-title">
      <header className="pg-head">
        <h1 id="pg-title" className="pg-title" aria-label="Pricing Guide">
          <span aria-hidden style={{ textAlign: 'left' }}>
            PRICING
          </span>
          <span
            aria-hidden
            style={{ textAlign: 'right', paddingRight: '250px' }}
          >
            GUIDE
          </span>
        </h1>

        <div className="pg-meta">
          <div className="pg-service">For: {service.title.toUpperCase()}</div>
          <div className="pg-company">Switch Case Studio</div>
        </div>

        {heroSrc && (
          <figure className="pg-blob">
            <video
              src={heroSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          </figure>
        )}
      </header>

      <div className="pg-packages">
        {service.tiers.map((tier, idx) => (
          <article key={tier.name} className="pg-package" role="listitem">
            <div className="pg-row">
              <div className="pg-row__name">{tier.name}</div>
              <div className="pg-row__leader" aria-hidden />
              <div className="pg-row__price">
                {formatMoney(tier.price)}
                {tier.billing === 'monthly' ? '/mo' : ''}
              </div>
            </div>

            <ul className="pg-list">
              {tier.includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="pg-outro">
        <p className="pg-outro__line">
          Think of this as a starting point - real pricing depends on the size,
          complexity, and goals of your project. Let’s talk through the details
          so we can put together the right plan for you.
        </p>
      </div>

      <hr className="pg-sep pg-sep--wide" />

      <footer className="pg-footer" aria-label="Contact">
        <a
          className="pg-link"
          href="https://calendar.app.google/83UCJjis2FHUrr1s6"
          target="_blank"
          rel="noreferrer"
        >
          BOOK A FREE CALL NOW
        </a>
        <a
          className="pg-link"
          href="mailto:hello@switchcasestudio.com"
          target="_blank"
          rel="noreferrer"
        >
          hello@switchcasestudio.com
        </a>
        {/* <div className="pg-phone">TEL. +1-234-567-8910</div> */}
      </footer>
    </section>
  );
};
