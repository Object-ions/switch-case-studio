/* Start a muted inline video, and recover when the browser refuses.
   iOS Low Power Mode (and some data-saver settings) block even muted
   autoplay: play() rejects and Safari paints its big play button over the
   poster. The button is hidden in app.scss; here a refused video retries on
   the visitor's first tap anywhere, which counts as a user gesture. Until
   then the poster stands in. Returns a cleanup. */
const GESTURES = ['touchend', 'pointerup', 'click', 'keydown'];

export default function playMuted(video) {
  if (!video) return () => {};
  video.muted = true;
  let armed = false;
  const retry = () => {
    disarm();
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };
  const disarm = () => {
    if (!armed) return;
    armed = false;
    GESTURES.forEach((t) => document.removeEventListener(t, retry, true));
  };
  const p = video.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {
      if (armed) return;
      armed = true;
      GESTURES.forEach((t) => document.addEventListener(t, retry, { capture: true, passive: true }));
    });
  }
  return disarm;
}
