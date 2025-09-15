'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import animationData from '../assets/lottie//animationWhitespaced.json';

const LogoAnimatedFooter = forwardRef(
  (
    {
      width = '100%',
      height = 'auto',
      className = '',
      style = {},
      ariaLabel = 'Animated logo',
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
      let mounted = true;

      // Load lottie-web only on the client
      import('lottie-web').then(({ default: lottie }) => {
        if (!mounted || !containerRef.current) return;

        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true, // play once on mount
          animationData,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        });

        // Respect reduced motion
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (media.matches) animRef.current.setSpeed(0.75);
      });

      return () => {
        mounted = false;
        try {
          animRef.current?.destroy();
        } catch {
          // no-op
        }
        animRef.current = null;
      };
    }, []);

    // Expose replay() to parent
    useImperativeHandle(ref, () => ({
      replay() {
        if (animRef.current) {
          animRef.current.goToAndPlay(0, true);
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          display: 'inline-block',
          ...style,
        }}
        aria-label={ariaLabel}
        role="img"
      />
    );
  }
);

LogoAnimatedFooter.displayName = 'LogoAnimatedFooter';

export default LogoAnimatedFooter;
