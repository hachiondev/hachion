import Image from "next/image";
import "./Loader.css";

// Ported from the CRA app's src/Components/UserPanel/Common/Loader/Loader.jsx.
// The original pointed at /HachionLogo.png, which doesn't exist in this
// repo's public/ folder — using the equivalent logo asset that does
// (public/Hachion-logo.png) instead of shipping a 404'd image.
const Loader = () => {
  return (
    <div className="loading-overlay">
      <Image
        src="/Hachion-logo.png"
        alt="Loading..."
        className="loading-logo"
        width={100}
        height={100}
      />
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
