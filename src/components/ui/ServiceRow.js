import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCode,
  faServer,
  faPenNib,
  faWandMagicSparkles,
  faLightbulb,
  faChartLine,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';

import '../../styles/components/serviceRow.scss';

// services.json stores icon names as strings; faSearchengin is a brand icon
// (not in free-solid) → use faChartLine.
const ICONS = {
  faCode,
  faServer,
  faPenNib,
  faWandMagicSparkles,
  faLightbulb,
  faSearchengin: faChartLine,
};

const BLOB = 'rgba(217, 156, 255, 0.9)'; // lilac $g6

const MotionLink = motion.create(Link);

/**
 * ServiceRow — a full-width index row: icon + service name on the left, the
 * arrow on the right. On hover the row highlights, the arrow circle fills
 * lilac, and the subtitle reveals word-by-word on the right. Reduced-motion
 * users see the subtitle statically.
 */
const ServiceRow = ({ to, iconName, title, subtitle, variants }) => {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const icon = ICONS[iconName] || faCircle;
  const words = (subtitle || '').split(' ');
  const show = reduced || hovered;

  return (
    <MotionLink
      to={to}
      className="svc-row"
      variants={variants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {!reduced && (
        <motion.span
          className="svc-row__glow"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: hovered ? 0.55 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            background: `radial-gradient(circle, ${BLOB} 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
      )}

      <span className="svc-row__icon" aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </span>

      <span className="svc-row__title">{title}</span>

      <span className="svc-row__sub" aria-hidden="true">
        {words.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            className="svc-row__word"
            initial={false}
            animate={{
              opacity: show ? 1 : 0,
              filter: show ? 'blur(0px)' : 'blur(3px)',
            }}
            transition={{
              duration: 0.3,
              delay: hovered && !reduced ? i * 0.025 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
          </motion.span>
        ))}
      </span>

      <motion.span
        className="svc-row__arrow"
        aria-hidden="true"
        initial={false}
        animate={{
          backgroundColor: hovered ? BLOB : 'rgba(255,255,255,0.08)',
          color: hovered ? '#1a1a1a' : 'rgba(255,255,255,0.55)',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          animate={{ x: hovered ? 2 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'inline-flex' }}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </motion.span>
      </motion.span>
    </MotionLink>
  );
};

export default ServiceRow;
