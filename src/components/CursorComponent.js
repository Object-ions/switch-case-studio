import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "../styles/components/cursorComponent.scss";

const CursorComponent = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
  
    const onMove = (e) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };
  
    const selector =
      "a, button, [role='button'], input[type='button'], input[type='submit'], summary, label, [data-cursor-color]";
  
    const onOver = (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
  
      // look for custom color
      const custom = target.getAttribute("data-cursor-color");
      if (custom) {
        dot.style.setProperty("--cursor-color", custom);
      } else {
        dot.style.removeProperty("--cursor-color"); // fallback will be used
      }
  
      dot.classList.add("is-hovering");
    };
  
    const onOut = (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
  
      dot.classList.remove("is-hovering");
      dot.style.removeProperty("--cursor-color");
    };
  
    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
  
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
    };
  }, []);
  

  return createPortal(<div id="cursor-dot" ref={dotRef} />, document.body);
};

export default CursorComponent;
