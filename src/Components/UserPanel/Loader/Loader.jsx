import "./Loader.css";

const Loader = () => {
  return (
    <div className="loading-overlay">
        <img
          src="/HachionLogo.png"
          alt="Loading..."
          className="loading-logo"
        />
        <div className="spinner"></div>
    </div>
  );
};

export default Loader;
