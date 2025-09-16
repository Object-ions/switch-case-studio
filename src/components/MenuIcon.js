"use client";
import { motion } from "framer-motion";

const lineVariants = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  animate: (custom) => ({
    rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
    y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
    opacity: custom === 2 ? 0 : 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  }),
};

export default function MenuIcon({
  open,
  className = "",
  size = 28,
  color = "#fff",
  strokeWidth = 2, // NEW: make stroke width configurable
  style,
  ...props
}) {
  const state = open ? "animate" : "normal";

  return (
    <div
      className={className}
      // ensure the SVG sees the intended color even if no CSS sets it
      style={{ color, ...style }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor" // ties to parent “color”
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: "visible" }}
        aria-hidden="true"
        focusable="false"
      >
        <motion.line
          x1="4"
          y1="6"
          x2="20"
          y2="6"
          variants={lineVariants}
          animate={state}
          custom={1}
        />
        <motion.line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          variants={lineVariants}
          animate={state}
          custom={2}
        />
        <motion.line
          x1="4"
          y1="18"
          x2="20"
          y2="18"
          variants={lineVariants}
          animate={state}
          custom={3}
        />
      </svg>
    </div>
  );
}
