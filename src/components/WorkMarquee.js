import { useEffect, useRef } from "react";
import "../styles/components/marquee.scss";

const WorkMarquee = () => {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const container = el.parentElement;
    const distance = el.scrollWidth + container.clientWidth;
    const seconds = Math.max(8, distance / 500);
    container.style.setProperty("--marquee-duration", `${seconds}s`);
  }, []);

  return (
    <div className="work-marquee" aria-hidden="true">
      <div ref={trackRef} className="work-marquee__track">
        Unleash Your Digital Potential with {"< Switch Case Studio />"}
      </div>
    </div>
  );
};

export default WorkMarquee;
