import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <p className="brand">
        {'<'} Switch Case Studio {'/>'}
      </p>

      <div className="navbar">
        <Link to={'/'}>About</Link>
        <Link to={'/'}>Work</Link>
        <Link to={'/'}>Testimonials</Link>
      </div>

      <div className="contact">
        <Link to={'/'}>Contact</Link>
      </div>
    </header>
  );
};

export default Header;
