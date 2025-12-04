import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AvatarCount from "./AvatarCount";
import { motion } from "framer-motion";
import "../Home.css";
import "../Buttons.css";
import BannerButtonPopup from "./BannerButtonPopup";

const Banner = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-banner-background container">
    <div className="home-banner">
      {/* Left side content */}
      <motion.div
        className="home-content"
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <h1 className="home-title">
          <span className="home-title-span">Boost Your Career</span> with
          <br />
          Industry-Recognized
          <br />
          IT Certifications
        </h1>
        <p className="home-title-text">
          Learn from flexible, affordable, and expert-designed courses trusted by
          25,000+ learners worldwide. Upgrade your skills anytime, anywhere – and
          achieve your career goals faster.
        </p>
        <div className="avatar-row">
          <AvatarCount /> <span className="home-sub-text">Join with us</span>
        </div>
        <div className="button-row">
          <button
            className="home-start-button"
            onClick={() => setShowPopup(true)}
          >
            Start Your Certification
          </button>

          <Link to="/coursedetails" className="home-browse-button">
          Browse All Courses
        </Link>
        </div>
      </motion.div>

      {/* Right side image */}
      <motion.img
        className="home-banner-img"
        src="/home-banner1.webp"
        alt="Home banner"
        fetchpriority="high"
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {showPopup && <BannerButtonPopup onClose={() => setShowPopup(false)} />}
    </div>
    </div>
  );
};

export default Banner;


