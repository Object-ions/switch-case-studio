/**
 * Motion tokens — JS mirror of the SCSS set in src/styles/_variables.scss.
 * Keep the two files in sync. All NEW GSAP / motion-react work reads from
 * here; existing inline values migrate opportunistically, never as a churn
 * pass.
 */

// Durations (seconds — GSAP units)
export const DUR_FAST = 0.2; // hovers, small state changes
export const DUR_MED = 0.4; // accordion, small entrances
export const DUR_SLOW = 0.7; // section reveals

// Eases
export const EASE_OUT = 'power3.out'; // standard decel (≈ cubic-bezier(0.22,1,0.36,1))
export const EASE_OUT_SOFT = 'power2.out'; // gentler decel used by house reveals
export const EASE_BRAND = 'back.out(1.56)'; // playful overshoot (logo hover curve)

// House safe-reveal defaults (play-once onEnter pattern)
export const REVEAL_Y = 24; // px rise
export const REVEAL_STAGGER = 0.08;
export const REVEAL_SAFETY_DELAY = 3; // delayedCall net (seconds)
