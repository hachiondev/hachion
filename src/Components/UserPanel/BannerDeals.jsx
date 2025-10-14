import React from "react";
import "./Home.css";
import DiscountCards from "./DiscountCards";
import {  useNavigate } from 'react-router-dom';

const BannerDeals = () => {
  const navigate= useNavigate();

  return (
    <div className="discount-popup-component container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <h4 className="popup-title-text">Top Courses in Your Area</h4>
        {/* <h4 className="popup-title-text">
         Upcoming Training and events in your location
        </h4> */}
        <p className="popup-content">Boost your career with the most in-demand courses near you.</p>
        <p className="popup-content"><span>🎓 200+ learners</span> from your city are already certified!</p>
        <div className="button-row">
          <button className="limited-deal-button" onClick={() => {navigate("/discountdeals");}}>Explore Courses</button>
        </div>
        </div>

      {/* Right side image */}
      <DiscountCards  />
    </div>
  );
};

export default BannerDeals;