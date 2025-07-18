import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useFloatingScroll = (ref) => {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const floatAnim = gsap.to(el, {
      y: () => gsap.utils.random(-40, 40),
      x: () => gsap.utils.random(-30, 30),
      rotate: () => gsap.utils.random(-2, 2),
      duration: gsap.utils.random(5, 7),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      paused: true, // start paused
      opacity: () => gsap.utils.random(0.85, 1),
      scale: () => gsap.utils.random(0.95, 1.15),
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => floatAnim.play(),
    });

    return () => {
      floatAnim.kill();
      trigger.kill();
    };
  }, [ref]);
};

export default useFloatingScroll;
