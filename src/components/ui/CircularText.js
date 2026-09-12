import { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';

import '../../styles/components/circularText.scss';

/* CircularText (React Bits, 2026-09-12): letters set on a circle that spins;
   hover changes the spin (speedUp | slowDown | pause | goBonkers). The ring
   is decorative, so it is aria-hidden and the text is given once as a label.
   Reduced motion: it stands still. Motion owns the ring's transform; the
   letters' transforms are static inline styles, identical on server and
   client. */

const spring = { type: 'spring', damping: 20, stiffness: 300 };

const getTransition = (duration, from) => ({
  rotate: { from, to: from + 360, ease: 'linear', duration, type: 'tween', repeat: Infinity },
  scale: spring,
});

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '' }) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const reducedMotion = useReducedMotion();

  const spin = (duration, scale = 1) => {
    const start = rotation.get();
    controls.start({ rotate: start + 360, scale, transition: getTransition(duration, start) });
  };

  useEffect(() => {
    if (reducedMotion) {
      controls.stop();
      return;
    }
    spin(spinDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, text, onHover, reducedMotion]);

  const handleHoverStart = () => {
    if (!onHover || reducedMotion) return;
    switch (onHover) {
      case 'slowDown':
        spin(spinDuration * 2);
        break;
      case 'speedUp':
        spin(spinDuration / 4);
        break;
      case 'pause':
        controls.start({ rotate: rotation.get(), scale: 1, transition: { rotate: spring, scale: spring } });
        break;
      case 'goBonkers':
        spin(spinDuration / 20, 0.8);
        break;
      default:
        spin(spinDuration);
    }
  };

  const handleHoverEnd = () => {
    if (!reducedMotion) spin(spinDuration);
  };

  return (
    <motion.div
      className={`circular-text ${className}`.trim()}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      role="img"
      aria-label={text.replace(/\*/g, ' ')}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const offset = (Math.PI / letters.length) * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${offset}px, ${offset}px, 0)`;
        return (
          <span key={i} aria-hidden="true" style={{ transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
