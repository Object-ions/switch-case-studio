import '../styles/components/bauhaus.scss';
const Bauhaus = () => {
  return (
    <div className="composition">
      <div className="block red">
        <div className="orange"></div>
        <div className="aqua"></div>
      </div>
      <div className="block blue" />
      <div className="block green">
        <div className="chartreuse"></div>
        <div className="darkgreen"></div>
      </div>
      <div className="block yellow" />
      <div className="block pink" />
    </div>
  );
};

export default Bauhaus;
