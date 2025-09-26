// BannerButtonPopup.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Home.css";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import DemandingCourses from "./DemandingCourses";
import PopupUpcomingCourses from "./PopupUpcomingCourses";

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
          <DemandingCourses />
          <p className="popup-content"><span>200+ students</span> are enrolled from your location and they got certified on these technologies.</p>
          <p className="popup-sub-content">Would you link to enroll for any of these above courses?</p>
          <PopupUpcomingCourses />
        </div>

        {/* Footer/Actions */}
        <div className="popup-bottom">
        <div className="popup-badge">NEW</div>
          <p className="popup-bottom-text">
            Discount available on these courses, hurry up to enroll and grab the
            discount price, it’s a very limited offer.
          </p>
          <button
            className="join-now"
            onClick={() => navigate("/coursedetails")}
          >
            Signup and Talk to Course Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerButtonPopup;
