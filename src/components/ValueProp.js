import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WaveShader from './WaveShader';
import useReducedMotion from '../hooks/useReducedMotion';

import '../styles/components/valueProp.scss';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    eyebrow: 'The problem',
    body: 'Most agencies hand you a template and call it strategy. Generic systems, recycled layouts, work that could belong to anyone.',
  },
  {
    eyebrow: 'The approach',
    body: 'We build every site, brand, and campaign from scratch — design, development, and marketing under one roof, with one team that actually talks to each other.',
  },
  {
    eyebrow: 'The outcome',
    body: "You get work that's unmistakably yours. Sites that perform, brands that compound, and a partner still answering the phone a year later.",
  },
];

const REVEAL = 0.7;
const DWELL = 0.3;
const STEP_DURATION = REVEAL + DWELL;

// Wave presets per step — hue shifts across the brand ramp,
// amplitude/warp shift the "feel" from chaotic → calm → confident
const STEP_PRESETS = [
  {
    // Step 1 — chaotic, purple-heavy
    amp: 0.16,
    freq: 1.0,
    complexity: 0.85,
    speed: 0.55,
    thickness: 0.07,
    hue: 0.05,
    curve: -0.18,
    warp: 0.1,
    chroma: 0.65,
    bias: 0.04,
  },
  {
    // Step 2 — mid-blend, calmer
    amp: 0.26,
    freq: 0.45,
    complexity: 0.45,
    speed: 0.4,
    thickness: 0.11,
    hue: 0.3,
    curve: 0.22,
    warp: 0.03,
    chroma: 0.9,
    bias: -0.02,
  },
  {
    // Step 3 — smooth, orange-heavy, confident
    amp: 0.1,
    freq: 0.32,
    complexity: 0.2,
    speed: 0.22,
    thickness: 0.16,
    hue: 0.65,
    curve: 0.05,
    warp: 0.0,
    chroma: 0.95,
    bias: 0.0,
  },
];

const ValueProp = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const progressBarRef = useRef(null);
  const stepRefs = useRef([]);
  const wordRefs = useRef(STEPS.map(() => []));
  const waveRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const bar = progressBarRef.current;
    if (!section || !pin || !bar) return;

    const SCROLL_PER_STEP = window.innerHeight;
    const totalScroll = SCROLL_PER_STEP * STEPS.length;

    gsap.set(bar, { scaleX: 0, transformOrigin: '0 0' });
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
    });
    wordRefs.current.forEach((words) => {
      words.forEach((w) => {
        if (w) w.classList.remove('is-bright');
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        scrub: true,
        pin: pin,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(bar, { scaleX: self.progress });
        },
      },
    });

    const waveShape = { ...STEP_PRESETS[0] };
    const pushWave = () => waveRef.current?.setParams(waveShape);

    STEPS.forEach((_, i) => {
      const stepEl = stepRefs.current[i];
      const words = wordRefs.current[i] ?? [];
      if (!stepEl) return;

      const stepStart = i * STEP_DURATION;

      if (i > 0) {
        const prev = stepRefs.current[i - 1];
        if (prev) {
          tl.to(
            prev,
            { autoAlpha: 0, duration: 0.15, ease: 'none' },
            stepStart - 0.15
          );
        }
        tl.to(
          stepEl,
          { autoAlpha: 1, duration: 0.15, ease: 'none' },
          stepStart - 0.15
        );

        const target = STEP_PRESETS[i];
        tl.to(
          waveShape,
          {
            amp: target.amp,
            freq: target.freq,
            complexity: target.complexity,
            speed: target.speed,
            thickness: target.thickness,
            hue: target.hue,
            curve: target.curve,
            warp: target.warp,
            chroma: target.chroma,
            bias: target.bias,
            duration: STEP_DURATION,
            ease: 'power2.inOut',
            onUpdate: pushWave,
          },
          stepStart - STEP_DURATION * 0.5
        );
      }

      const perWord = REVEAL / Math.max(words.length, 1);
      words.forEach((wEl, wi) => {
        if (!wEl) return;
        tl.call(
          () => wEl.classList.add('is-bright'),
          null,
          stepStart + wi * perWord
        );
      });

      tl.to({}, { duration: DWELL }, stepStart + REVEAL);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="value-prop"
      className="value-prop"
      aria-label="How we work"
    >
      <div ref={pinRef} className="value-prop__pin">
        <div className="value-prop__shader-wrap" aria-hidden="true">
          {!reducedMotion && (
            <WaveShader ref={waveRef} initialParams={STEP_PRESETS[0]} />
          )}
        </div>

        <div className="value-prop__progress" aria-hidden="true">
          <div ref={progressBarRef} className="value-prop__progress-bar" />
        </div>

        <div className="value-prop__header">
          <h2 className="value-prop__heading">
            A studio built for brands who'd rather lead than blend in.
          </h2>
          <a href="/#projects" className="value-prop__more">
            See our work
            <span className="cta-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="value-prop__steps">
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="value-prop__step"
            >
              <div className="value-prop__step-meta">
                <span className="value-prop__counter">
                  {String(i + 1).padStart(2, '0')}
                  <span className="value-prop__counter-sep">/</span>
                  {String(STEPS.length).padStart(2, '0')}
                </span>
                <p className="value-prop__eyebrow">{step.eyebrow}</p>
              </div>

              <p className="value-prop__body">
                {step.body.split(' ').map((word, wi, arr) => (
                  <span key={wi}>
                    <span
                      className="value-prop__word"
                      ref={(el) => {
                        const ws = wordRefs.current[i];
                        if (ws) ws[wi] = el;
                      }}
                    >
                      {word}
                    </span>
                    {wi < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
