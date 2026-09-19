"use client";

// BannerButtonPopup.js
import React, { useEffect, useRef } from "react";
import "../../Home.css";
import { IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import BannerDeals from "../../BannerButtonPopupPage/BannerDeals";

const BannerButtonPopup = ({ onClose }) => {
  const router = useRouter();
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
    <div className="popup-overlay is-open">
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
          <p className="popup-bottom-text">
            💥 Limited-time discounts available — hurry before the offer ends!
          </p>
          <button
            className="join-now"
            onClick={() => router.push("/contactus")}
          >
           Talk to Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerButtonPopup;
