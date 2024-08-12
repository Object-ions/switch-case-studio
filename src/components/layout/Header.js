import '../../styles/components/header.scss';

const Header = () => {
  return (
    <header>
      <div className="header">
        <a href="#home" className="brand">
          {'<'} SC {'/>'}
        </a>

        <div className="navbar">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#work">Work</a>
          <a href="#testimonials">Testimonials</a>
        </div>

        <div className="contact">
          <a href="#contact">Contact</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
