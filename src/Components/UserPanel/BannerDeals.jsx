import React from "react";
import "./Home.css";
import DiscountCards from "./DiscountCards";
import {  useNavigate } from 'react-router-dom';

const BannerDeals = () => {
  const navigate= useNavigate();

  return (
    <div className="limited-component container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <h4 className="popup-title-text">The Courses most demanding in your location</h4>
        <h4 className="popup-title-text">
         Upcoming Training and events in your location
        </h4>
        <p className="popup-content"><span>200+ students</span> are enrolled from your location and they got certified on these technologies.</p>
        <div className="button-row">
          <button className="limited-deal-button" onClick={() => {navigate("/discountdeals");}}>Explore All Deals</button>
        </div>
        </div>

      {/* Right side image */}
      <DiscountCards  />
    </div>
  );
};

export default BannerDeals;