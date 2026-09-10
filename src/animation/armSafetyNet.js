import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Viewport-aware safety net for scroll reveals (2026-09-10).
 *
 * The house net used to be `gsap.delayedCall(3, forceVisible)` from MOUNT.
 * That keeps the never-invisible law, but on this home page the ident holds
 * visitors on the hero for 4.5s, so every net below had fired before the
 * first scroll and no section animated at all ("I don't feel much change").
 *
 * This net still forces visibility, but only for an element that is on
 * screen (or already scrolled past) and still hidden after `delay` seconds;
 * an element waiting below the fold keeps waiting for its real trigger and
 * is re-checked every `recheck` seconds. Returns a cleanup.
 *
 * @param {Element} el       element whose viewport presence decides
 * @param {() => boolean} isDone   true once the reveal has run
 * @param {() => void} force       set the end state immediately
 */
export default function armSafetyNet(el, isDone, force, { delay = 3, recheck = 1 } = {}) {
  let call = null;
  const check = () => {
    if (isDone()) return;
    const rect = el.getBoundingClientRect();
    const onScreen = ScrollTrigger.isInViewport(el, 0.05) || rect.bottom < 0;
    if (onScreen) {
      force();
      return;
    }
    call = gsap.delayedCall(recheck, check);
  };
  call = gsap.delayedCall(delay, check);
  return () => {
    if (call) call.kill();
  };
}
