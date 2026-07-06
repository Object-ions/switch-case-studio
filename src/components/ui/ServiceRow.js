import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import '../../styles/components/serviceRow.scss';

const MotionLink = motion.create(Link);

/**
 * ServiceRow — the confident full-width index row shared by /services and
 * /pricing (the "one family, three roles" system; the homepage Services
 * teaser is a separate component and stays untouched).
 *
 * Mirrors the homepage row: big uppercase Inter-300 title + an always-visible
 * one-line description; on hover the whole row fills pale lilac ($g7) with ink
 * text. Dropped the old icon + circular arrow-chip + faint glow that made the
 * page read like a template.
 *
 * Roles diverge by CONTENT, not a weaker style:
 *   /services → description + arrow (the explainer).
 *   /pricing  → adds a "from $X" anchor + "See pricing" (the priced menu),
 *               so it isn't a clone of /services.
 *
 * Hover is pure CSS (serviceRow.scss); the only JS motion is the staggered
 * entrance via `variants`.
 */
const ServiceRow = ({ to, title, description, price, priced, variants }) => (
  <MotionLink to={to} className="svc-row" variants={variants}>
    <span className="svc-row__main">
      <span className="svc-row__title">{title}</span>
      {description && <span className="svc-row__desc">{description}</span>}
    </span>

    <span className="svc-row__meta">
      {price && (
        <span className="svc-row__price">
          <span className="svc-row__price-from">from</span> {price}
        </span>
      )}
      <span className="svc-row__cta">
        {priced && <span className="svc-row__cta-label">See pricing</span>}
        <span className="svc-row__arrow" aria-hidden="true">
          &rarr;
        </span>
      </span>
    </span>
  </MotionLink>
);

export default ServiceRow;
