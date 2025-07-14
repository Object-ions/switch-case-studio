import img from '../../assets/gifs/poloroid-dump-bw-small.gif';

import '../../styles/components/about.scss';

const About = () => {
  return (
    <div id="about">
      <div className="about-content">
        <h1>
          {'< Switch'}&nbsp;<span>{'Case />'}</span>
        </h1>
        <h2>Let's build something exceptional together</h2>
        <div className="about-text">
          <p>
            We design and build websites that work as good as they look. Whether
            you're launching a new brand, refreshing your digital presence, or
            scaling an online store, we help businesses show up sharp and stay
            ahead. We're a small, hands-on team that combines clean design with
            smart development—bringing together visuals, usability, and
            performance. From first sketch to final deployment, we focus on what
            matters: thoughtful design, fast websites, and clear results. Our
            services include: Web design & development SEO and analytics Graphic
            design & branding Email marketing Hosting & support Let’s make
            something that fits your business and feels like you.
          </p>
        </div>
        <div className="image-wrapper">
          <img src={img} alt="Switch Case Studio" />
        </div>

        <div className="circle-container">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
