import '../styles/components/ascii.scss';

const Ascii = () => {
  return (
    <div className="ascii">
      <div className="ascii-label">ASCII_ART:</div>
      <pre className="ascii-art">
        {`  ██████  ██     ██ 
 ██       ██     ██ 
 ██████   ██  █  ██ 
      ██  ██ ███ ██ 
 ██████    ███ ███  `}
      </pre>
    </div>
  );
};

export default Ascii;
