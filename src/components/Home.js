const Home = () => {
  return (
    <div className="home">
      <p className="grid-item p-hello">hello</p>
      <div className="grid-item hero">
        <h1>lorem ipsum dolor</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl
          eros, pulvinar facilisis justo mollis, auctor consequat urna.
        </p>
      </div>
      <img
        className="grid-item img"
        src="path/to/your/image.jpg"
        alt="Description"
      />
    </div>
  );
};

export default Home;
