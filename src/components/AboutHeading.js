import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutHeading = () => {
  useEffect(() => {
    const words = gsap.utils.toArray('.word');

    gsap.set(words, { color: '#e9add7' }); // initial color

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.work-heading',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    });

    words.forEach((word, i) => {
      tl.to(word, { color: '#ff8347' }, i * 0.05); // highlight one by one
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const text = `We build websites, e-commerce stores, and apps that convert — designed from scratch, shipped fast, and backed by a team that actually cares about your results`;

  const wrappedWords = text.split(' ').map((word, idx) => (
    <span key={idx} className="word">
      {word}&nbsp;
    </span>
  ));

  return (
    <div className="work-heading">
      <p>{wrappedWords}</p>
    </div>
  );
};

export default AboutHeading;
