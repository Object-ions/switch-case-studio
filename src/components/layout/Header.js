import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="brand">
          <Link to="/">
            {'<'} Switch Case Studio {'/>'}
          </Link>
        </div>

        <div className="navbar">
          <Link to={'/'}>About</Link>
          <Link to={'/'}>Work</Link>
          <Link to={'/'}>Testimonials</Link>
        </div>

        <div className="contact">
          <Link to={'/'}>Contact</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
