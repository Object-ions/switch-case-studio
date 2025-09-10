'use client';
import { useEffect, useRef } from 'react';
import data from '../assets/lottie/SCS_Logo_Bauhaus.json';

const SCSLogo = ({
  width = 30,
  height = 30,
  hoverReplay = false,
  className,
  style,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    let anim = null;
    let mounted = true;

    import('lottie-web').then(({ default: lottie }) => {
      if (!mounted || !ref.current) return;

      anim = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: data, // <-- pass data, no XHR
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });

      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) anim.setSpeed(0.75);

      if (hoverReplay && ref.current) {
        const onEnter = () => anim.goToAndPlay(0, true);
        ref.current.addEventListener('mouseenter', onEnter);
        ref.current._onEnter = onEnter;
      }
    });

    return () => {
      mounted = false;
      if (ref.current && ref.current._onEnter) {
        ref.current.removeEventListener('mouseenter', ref.current._onEnter);
        delete ref.current._onEnter;
      }
      try { anim && anim.destroy(); } catch {}
    };
  }, [hoverReplay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width, height, ...style }}
      aria-label="Switch Case Studio logo animation"
    />
  );
};

export default SCSLogo;
