// Shared entrance animations — the "Reviews" (TestimonialsPage) load,
// reused across the standalone pages so they all animate identically.
const EASE = [0.25, 0.46, 0.45, 0.94];

// Header: staggers its lines (kicker / title / lede).
export const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// A single header line: rises + wipes in from the top (clip-path).
export const lineVariant = {
  hidden: { opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.7, ease: EASE },
  },
};

// Grid / list: staggers its children in.
export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// A single card / row: rises + scales up slightly.
export const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};
