import { useState, useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
  useReducedMotion,
} from 'motion/react';

/**
 * GradientText — animated gradient text using background-clip: text.
 *
 * Styles live in the parent component's SCSS file (e.g. testimonialHeading.scss)
 * under .animated-gradient-text and .text-content. No standalone CSS file.
 *
 * The component appends colors[0] at the end automatically for seamless looping.
 */
const GradientText = ({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    // VE-10: reduced motion — the gradient rests as a static multi-color
    // fill (progress stays 0), the RAF callback does nothing each frame.
    if (reducedMotion) return;
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;
      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(
          100 - ((cycleTime - animationDuration) / animationDuration) * 100,
        );
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, (p) => {
    if (direction === 'vertical') {
      return `50% ${p}%`;
    }
    // horizontal & diagonal both sweep horizontally to avoid interference
    return `${p}% 50%`;
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === 'horizontal'
      ? 'to right'
      : direction === 'vertical'
        ? 'to bottom'
        : 'to bottom right';

  // Duplicate first color at the end for seamless looping
  const gradientColors = [...colors, colors[0]].join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === 'horizontal'
        ? '300% 100%'
        : direction === 'vertical'
          ? '100% 300%'
          : '300% 300%',
    backgroundRepeat: 'repeat',
  };

  return (
    <motion.span
      className={`animated-gradient-text ${showBorder ? 'with-border' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <motion.span
          className="gradient-overlay"
          style={{ ...gradientStyle, backgroundPosition }}
          aria-hidden="true"
        />
      )}
      <motion.span
        className="text-content"
        style={{ ...gradientStyle, backgroundPosition }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

export default GradientText;
