import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import '../styles/components/welcomeTyped.scss';

const WelcomeTyped = () => {
  const typedElement = useRef(null);

  useEffect(() => {
    const options = {
      strings: [
        'Hello', // English
        '¡Hola!', // Spanish (Castilian)
        'Bonjour!', // French
        'Olá!', // Portuguese
        'Ciao!', // Italian
        'Hallo!', // German
        'Salut!', // Romanian
        'Ahoj!', // Czech
        'Helló!', // Hungarian
        'Halló!', // Icelandic
        'Cześć!', // Polish
        'Hej!', // Danish]
      ],
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
      showCursor: false, // Hide the default cursor
    };

    const typed = new Typed(typedElement.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="typed-cursor">
      <span ref={typedElement} className="typed-container" />
      <span
        className="cursor"
        style={{ animation: 'blink 0.7s infinite', paddingLeft: '0.2rem' }}
      >
        |
      </span>
    </div>
  );
};

export default WelcomeTyped;
