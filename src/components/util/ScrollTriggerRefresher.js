import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollTriggerRefresher() {
  const { pathname } = useLocation();
  useEffect(() => {
    // after layout paints for the new route
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);
  return null;
}
