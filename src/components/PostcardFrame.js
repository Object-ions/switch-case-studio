import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

/**
 * PostcardFrame
 * Pure presentational wrapper. Renders the postcard "stage" — the dark section
 * behind it lets the orange pop. Testimonial slides are passed in as children.
 *
 * Props:
 *  - children:     the slides markup (existing Testimonials .slide elements)
 *  - currentIndex: zero-based index of active testimonial
 *  - total:        total testimonial count
 *  - onSelect:     (index) => void — called when a ticket-number box is clicked
 *  - onPrev:       () => void — previous arrow handler
 *  - onNext:       () => void — next arrow handler
 *  - bodyRef:      forwarded ref attached to .postcard__body for GSAP entrance
 */
const PostcardFrame = ({
  children,
  currentIndex,
  total,
  onSelect,
  onPrev,
  onNext,
  bodyRef,
}) => {
  const counterLabel = `TESTIMONIAL ${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const internalBodyRef = useRef(null);
  const resolvedBodyRef = bodyRef || internalBodyRef;

  return (
    <div className="postcard">
      {/* SVG filter defs — torn paper edges + paper grain + fabric weave.
          Defined once, referenced via CSS. */}
      <svg className="postcard__defs" aria-hidden="true" focusable="false">
        <defs>
          {/* Torn paper rectangle — displaces edges of the orange body */}
          <filter id="postcard-tear" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.9"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>

          {/* Paper grain — fine fibrous noise, blended over the orange */}
          <filter id="postcard-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.55 0"
            />
          </filter>

          {/* Fabric weave — coarser noise for the canvas patch */}
          <filter id="postcard-fabric" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7 0.7"
              numOctaves="3"
              seed="11"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.7 0"
            />
          </filter>

          {/* Frayed edge mask — used by tape strips for organic outline */}
          <filter
            id="postcard-frayed"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.7"
              numOctaves="2"
              seed="5"
            />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>

      <div className="postcard__body" ref={resolvedBodyRef}>
        {/* TOP ROW: address block + postal strip */}
        <div className="postcard__top">
          <div className="postcard__address">
            <span className="postcard__address-line">Switch Case Studio</span>
            <span className="postcard__address-line">Portland, OR 97205</span>
          </div>

          <div className="postcard__postal-strip">
            <div
              className="postcard__barcode postcard__barcode--top"
              aria-hidden="true"
            />
            <div className="postcard__stamp-box" aria-hidden="true">
              <span className="postcard__stamp-label">Save a Stamp.</span>
              <span className="postcard__stamp-label">Pay online at:</span>
              <span className="postcard__stamp-redacted" />
              <span className="postcard__stamp-domain">citypay</span>
            </div>
          </div>
        </div>

        {/* Masking tape — purely decorative */}
        <span
          className="postcard__tape postcard__tape--tl"
          aria-hidden="true"
        />
        <span
          className="postcard__tape postcard__tape--br"
          aria-hidden="true"
        />
        <span
          className="postcard__tape postcard__tape--br-small"
          aria-hidden="true"
        />

        {/* CENTER PATCH — testimonial content lives here */}
        <div className="postcard__patch">{children}</div>

        {/* BOTTOM ROW: ticket counter + boxes (carousel dots) + arrows */}
        <div className="postcard__bottom">
          <div className="postcard__ticket">
            <span className="postcard__ticket-label">{counterLabel}</span>
            <span className="postcard__ticket-sublabel">
              (Click a box to jump)
            </span>
            <div
              className="postcard__ticket-boxes"
              role="tablist"
              aria-label="Select testimonial"
            >
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={`pc-box-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Show testimonial ${i + 1} of ${total}`}
                  className={`postcard__ticket-box ${i === currentIndex ? 'is-active' : ''}`}
                  onClick={() => onSelect && onSelect(i)}
                />
              ))}
            </div>
          </div>

          <div className="postcard__controls">
            <button
              type="button"
              className="postcard__ctrl"
              onClick={onPrev}
              aria-label="Previous testimonial"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              type="button"
              className="postcard__ctrl"
              onClick={onNext}
              aria-label="Next testimonial"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostcardFrame;
