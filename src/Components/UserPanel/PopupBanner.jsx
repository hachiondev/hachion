import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Home.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const PopupBanner = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupBanner, setPopupBanner] = useState(null);
  const navigate = useNavigate();
  const popupRef = useRef();

  useEffect(() => {
    const fetchPopupBanner = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/banner");
        const enabledPopup = response.data.find(
          (banner) => banner.status === "Enabled" && banner.banner_image
        );
        if (enabledPopup) {
          setPopupBanner(enabledPopup);
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error fetching popup banner:", error);
      }
    };

    fetchPopupBanner();
  }, []);

  const handleClose = () => setShowPopup(false);
  const handleExploreMore = () => navigate("/coursedetails");

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  if (!showPopup || !popupBanner) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        <button className="close-popup" onClick={handleClose}>
          <RiCloseCircleLine size={24} />
        </button>
        <a href="/coursedetails">
          <img
            src={`https://api.hachion.co/${popupBanner.banner_image}`}
            alt="Popup Banner"
            className="popup-image"
            fetchpriority="high"
          />
        </a>
        <div className="button-center">
          <button className="join-now" onClick={handleExploreMore}>
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupBanner;
