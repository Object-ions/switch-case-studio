import img from '../../assets/images/IMG_2987black.png';
import '../../styles/components/about.scss';

const About = () => {
  return (
    <div id="about">
      <div className="about-content">
        <h1> {'< Switch Case />'}</h1>
        <h2>At Switch Case Studio flexibility meets creativity.</h2>
        <div className="about-text">
          <p>
            My name is Moses, and I’m the founder and lead developer behind this
            versatile web development and design studio.
          </p>
          <p>
            With a background in Product Design from Shenkar College of
            Engineering and Design and extensive experience in full-stack
            development, I’ve honed my skills in both the creative and technical
            aspects of building modern digital solutions. My journey has taken
            me from intricate UI/UX designs to crafting powerful, responsive web
            applications using the latest technologies.
          </p>
          <p>
            I believe that every project is unique—just like the switch case
            statement in JavaScript, which allows for various outcomes based on
            different scenarios. This philosophy drives me to deliver customized
            solutions that adapt to the specific needs and goals of my clients.
            Whether you’re looking for a sleek, user-friendly website, robust
            SEO strategies, or compelling graphic designs, I’ve got you covered.
          </p>

          <p>
            I offer a wide range of services, including web design and
            development, SEO, web hosting, email marketing, and content
            creation. With a strong focus on detail and performance, I ensure
            that every project not only looks great but also functions
            seamlessly across all devices.
          </p>
          <p>
            My approach is hands-on and collaborative. I work closely with my
            clients to understand their vision and translate it into a digital
            experience that resonates with their audience. At Switch Case
            Studio, your satisfaction is my priority, and I’m committed to
            delivering results that exceed your expectations.
          </p>
          <p>
            Thank you for considering Switch Case Studio for your digital needs.
            I’m excited to collaborate with you and bring your vision to life.
          </p>
        </div>
        <div className="image-wrapper">
          <img src={img} alt="Switch Case Studio" />
        </div>
      </div>
    </div>
  );
};

export default About;
