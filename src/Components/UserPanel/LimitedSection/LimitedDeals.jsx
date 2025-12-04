
import "../Home.css";
import DiscountCards from "./components/DiscountCards";
import {  useNavigate } from 'react-router-dom';

const LimitedDeals = () => {
  const navigate= useNavigate();

  return (
    <div className="limited-component container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <h2 className="association-head">Limited Time Deals on Top Courses!</h2>
        <p className="limited-deals-text">
          Special prices on selected courses for a limited period. Countdown to savings starts now!
        </p>
        <div className="button-row">
          <button className="limited-deal-button" onClick={() => {navigate("/discountdeals");}}>Explore All Deals</button>
        </div>
        </div>

      {/* Right side image */}
      <DiscountCards  />
    </div>
  );
};

export default LimitedDeals;

