import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <p>
        {'<'} Switch Case Studio {'/>'}
      </p>

      <div className="navbar">
        <Link to={'/'}>About</Link>
        <Link to={'/'}>Work</Link>
        <Link to={'/'}>Testimonials</Link>
      </div>

      <Link to={'/'}>Contact</Link>
    </header>
  );
};

export default Header;
