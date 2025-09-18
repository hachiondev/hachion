import React, { useEffect, useState, useRef } from "react";
import KeyBenifit from "../../Assets/key.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import { FaBookReader } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";

const KeyBenifits = () => {

  return (
    <div className="instructor-banner">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title">Key Benefits of Learning with Us</h2>
        <p className="home-title-text">
          Explore the unique features that make our platform the perfect choice for your learning journey.
        </p>
        <div className="button-row">
          <button className="desktop-border-button">Start Learn Today</button>
        </div>
        <img
        className="key-image"
        src={KeyBenifit}
        alt="Key Benifit banner"
        fetchpriority="high"
      />
        </div>

      {/* Right side content */}
      <div className="home-content">
        <div>
        <p className="key-title-text">
        <FaBookReader />  Learn from Industry Experts
        </p>
      <p className="instructor-title-text">
         Gain knowledge from professionals with real-world experience. Learn insights, tips, and strategies used by industry leaders.
        </p>
        </div>
        <div>
        <p className="key-title-text">
        <MdAccessTimeFilled />  Flexible Learning Options
        </p>
      <p className="instructor-title-text">
         Study at your own pace, anytime and anywhere. Choose from self-paced courses or live sessions that suit your schedule.
        </p>
        </div>
        <div>
        <p className="key-title-text">
        <FaBookReader />  Interactive Learning Experience
        </p>
      <p className="instructor-title-text">
         Engage with quizzes, assignments, and peer interactions to solidify your knowledge and improve learning outcomes.
        </p>
        </div>
        <div>
        <p className="key-title-text">
        <FaBookReader />  Get Certified & Boost Your Career
        </p>
      <p className="instructor-title-text">
         Earn certificates that validate your skills and increase your job opportunities. Showcase your expertise to potential employers.
        </p>
        </div>
        <div>
        <p className="key-title-text">
        <FaBookReader />  Wide Range of Courses
        </p>
      <p className="instructor-title-text">
         Access diverse courses across various fields and disciplines, from technology to personal development and more.
        </p>
        </div>
    </div>
    </div>
  );
};

export default KeyBenifits;

