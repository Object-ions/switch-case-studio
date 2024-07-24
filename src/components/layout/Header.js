import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="brand">
          <Link to="/">
            {'<'} SC {'/>'}
          </Link>
        </div>

        <div className="navbar">
          <Link to={'/about'}>About</Link>
          <Link to={'/work'}>Work</Link>
          <Link to={'/pricing'}>Pricing</Link>
          <Link to={'/testimonials'}>Testimonials</Link>
        </div>

        <div className="contact">
          <Link to={'/contact'}>Contact</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
