import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import playMuted from '../../utils/playMuted';
import useReducedMotion from '../../hooks/useReducedMotion';

import '../../styles/components/motionReel.scss';

/* A case study's motion piece (2026-09-24, My Challah Dealer reel).
   The static HTML is the poster plus a paused, muted video: identical on
   server and client, so hydration can't disagree. At runtime the reel plays
   muted only while at least a third of it is on screen, and pauses off
   screen (a 9:16 video decoding below the fold is wasted main thread).
   Sound is opt-in through the button, which is a user gesture, so play()
   with sound is allowed. Reduced motion: no autoplay; native controls
   appear instead, so the visitor starts it. */
const MotionReel = ({ mp4, webm, poster, label }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    video.controls = reducedMotion;
    if (reducedMotion) return undefined;

    let disarm = () => {};
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.muted) disarm = playMuted(video);
          else video.play().catch(() => {});
        } else {
          disarm();
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      disarm();
      video.pause();
    };
  }, [reducedMotion]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) video.play().catch(() => {});
  };

  return (
    <div className="motion-reel">
      <video
        ref={videoRef}
        className="motion-reel__video"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        className="motion-reel__sound"
        onClick={toggleSound}
        aria-pressed={!muted}
      >
        <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} aria-hidden="true" />
        {muted ? 'Sound off' : 'Sound on'}
      </button>
    </div>
  );
};

export default MotionReel;
