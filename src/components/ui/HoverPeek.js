import { useState, useEffect } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import '../../styles/components/hoverPeek.scss';

/**
 * HoverPeek — floats a small card above the hovered element.
 *
 * Adapted from a Next.js/TS/Tailwind/framer-motion + Radix snippet to this
 * project's stack (motion/react, plain JS, SCSS). Trimmed to a clean peek:
 * the dynamic Microlink fetch, the magnifier lens, and the mouse-follow were
 * all dropped. Two modes: `imageSrc` shows a static screenshot (the /projects
 * grid), `content` renders arbitrary text/markup (the home case-study tiles,
 * where the tile itself shows the screenshot and the copy floats here).
 * Reduced-motion users get a plain fade instead of the 3D flip-in.
 *
 * @param {React.ReactNode} children - the trigger (rendered as-is via asChild)
 * @param {string} imageSrc - the preview image (e.g. a project's long.webp)
 * @param {React.ReactNode} content - text-card mode; wins over imageSrc
 * @param {string} alt
 * @param {number} width  - preview width in px (image mode only)
 * @param {number} height - preview height in px (image mode only)
 */
const HoverPeek = ({
  children,
  imageSrc,
  content,
  alt = '',
  width = 320,
  height = 200,
  openDelay = 75,
  closeDelay = 150,
}) => {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  // Reset the error state whenever the card closes or the source changes.
  useEffect(() => {
    if (!open) setFailed(false);
  }, [open]);
  useEffect(() => {
    setFailed(false);
  }, [imageSrc]);

  const variants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        initial: { opacity: 0, rotateY: -90, transition: { duration: 0.15 } },
        animate: {
          opacity: 1,
          rotateY: 0,
          transition: { type: 'spring', stiffness: 200, damping: 18 },
        },
        exit: { opacity: 0, rotateY: 90, transition: { duration: 0.15 } },
      };

  // Nothing to peek → just render the trigger.
  if (!imageSrc && !content) return children;

  return (
    <HoverCard.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      onOpenChange={setOpen}
    >
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="hover-peek"
          side="top"
          align="center"
          sideOffset={12}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="hover-peek__card"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {content ? (
                  <div className="hover-peek__text">{content}</div>
                ) : failed ? (
                  <div
                    className="hover-peek__fallback"
                    style={{ width, height }}
                  >
                    Preview unavailable
                  </div>
                ) : (
                  <img
                    src={imageSrc}
                    width={width}
                    height={height}
                    // Inline w/h so a global `img { height:auto }` reset can't
                    // stretch the tall screenshot — object-fit then crops it.
                    style={{ width, height }}
                    className="hover-peek__img"
                    alt={alt}
                    loading="lazy"
                    onError={() => setFailed(true)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default HoverPeek;
