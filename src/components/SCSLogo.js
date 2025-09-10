'use client';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import data from '../assets/lottie/SCS_Logo_Bauhaus.json';

const SCSLogo = forwardRef(({ width = 30, height = 30, className, style }, ref) => {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    import('lottie-web').then(({ default: lottie }) => {
      if (!mounted || !containerRef.current) return;

      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: data,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });

      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) animRef.current.setSpeed(0.75);
    });

    return () => {
      mounted = false;
      try { animRef.current?.destroy(); } catch {}
    };
  }, []);

  // Expose replay() to parent
  useImperativeHandle(ref, () => ({
    replay() {
      if (animRef.current) {
        animRef.current.goToAndPlay(0, true);
      }
    }
  }));

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height, ...style }}
      aria-label="Switch Case Studio logo animation"
    />
  );
});

export default SCSLogo;
