import React, { useEffect, useState, useRef } from "react";
import Instructorbanner from "../../Assets/topinstructor.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import DiscountCards from "./DiscountCards";

const LimitedDeals = () => {

  return (
    <div className="instructor-banner container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <h2 className="association-head">Limited Time Deals on Top Courses!</h2>
        <p className="limited-deals-text">
          Special prices on selected courses for a limited period. Countdown to savings starts now!
        </p>
        <div className="button-row">
          <button className="limited-deal-button">Explore All Deals</button>
        </div>
        </div>

      {/* Right side image */}
      <DiscountCards  />
    </div>
  );
};

export default LimitedDeals;

