import React from "react";
import "./Home.css";
import DiscountCards from "./DiscountCards";

const BannerDeals = () => {

  return (
    <div className="limited-component container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <p className="popup-title-text">The Courses most demanding in your UAE location</p>
        <p className="popup-title-text">
         Upcoming Training and events in your location
        </p>
        <p className="popup-content"><span>200+ students</span> are enrolled from your location and they got certified on these technologies.</p>
        <div className="button-row">
          <button className="limited-deal-button">Explore All Deals</button>
        </div>
        </div>

      {/* Right side image */}
      <DiscountCards  />
    </div>
  );
};

export default BannerDeals;