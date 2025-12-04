// BannerButtonPopup.js
import React, { useEffect, useState, useRef } from "react";
import "../Home.css";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BannerDeals from "./BannerDeals";

const BannerButtonPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const popupRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        
        {/* Header */}
        <div className="popup-header">
          <button className="close-popup" onClick={onClose}>
            <IoCloseSharp size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="popup-body">
          <BannerDeals />
        </div>

        {/* Footer/Actions */}
        <div className="popup-bottom">
        <div className="popup-badge">NEW</div>
          <p className="popup-bottom-text">
            {/* Discount available on these courses, hurry up to enroll and grab the
            discount price, it’s a very limited offer. */}
            💥 Limited-time discounts available — hurry before the offer ends!
          </p>
          <button
            className="join-now"
            onClick={() => navigate("/contactus")}
          >
           Talk to Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerButtonPopup;
