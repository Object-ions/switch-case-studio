import { useEffect, useRef } from "react";

export default function useScrollLock(isLocked) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position
    scrollYRef.current = window.scrollY;

    // Lock the body (works well on iOS + desktop)
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollYRef.current}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden"; // belt-and-suspenders

    // Prevent scroll chaining from modal to page
    document.documentElement.style.overscrollBehavior = "contain";

    return () => {
      // Restore styles
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      style.overflow = "";

      document.documentElement.style.overscrollBehavior = "";

      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isLocked]);
}
