import React, { useEffect, useState, useRef } from "react";
import KeyBenifit from "../../Assets/key.webp";
import KeyBenifit2 from "../../Assets/keynext.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import key1 from "../../Assets/key1.png";
import key2 from "../../Assets/key2.png";
import key3 from "../../Assets/key3.png";
import key4 from "../../Assets/key4.png";
import key5 from "../../Assets/key5.png";

const WhyChoose = () => {
  const images = [
    KeyBenifit,
    KeyBenifit2,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="instructor-banner">
      {/* Left side content */}
      <div className="home-content"
        onMouseEnter={() => setCurrentIndex(1)}
        onMouseLeave={() => setCurrentIndex(0)}>
        <h2 className="instructor-title">Why choose our certification courses?</h2>
        <p className="home-title-text">
          Advance your career with Hachion’s expert-led IT training, trusted by learners worldwide for its unique features.
        </p>
        <div className="button-row">
          <button className="border-button">Start Learn Today</button>
        </div>
        <hr className="seperater"/>
        <img
        src={images[currentIndex]}
        alt="Key Benefit banner"
        className="key-image"
        fetchpriority="high"
      />
        </div>

      {/* Right side content */}
      <div className="home-content">
        <div>
        <p className="key-title-text">
        <img src={key1} alt="knowledge" className="icon" />  Learn from Industry Experts
        </p>
      <p className="instructor-title-text">
         Gain knowledge from professionals with real-world experience. Learn insights, tips, and strategies used by industry leaders.
        </p>
        </div>
        <hr className="seperater"/>
        <div>
        <p className="key-title-text">
        <img src={key2} alt="Flexible" className="icon" />  Flexible Learning Options
        </p>
      <p className="instructor-title-text">
        Learn at your own pace with self-paced modules or live interactive classes that fit your schedule.
        </p>
        </div>
        <hr className="seperater"/>
        <div>
        <p className="key-title-text">
        <img src={key3} alt="Learning" className="icon" />  Interactive Learning Experience
        </p>
      <p className="instructor-title-text">
        Practice through real projects, assignments, and peer discussions for stronger skill retention.
        </p>
        </div>
        <hr className="seperater"/>
        <div>
        <p className="key-title-text">
        <img src={key4} alt="Certified" className="icon" />  Get Certified & Boost Your Career
        </p>
      <p className="instructor-title-text">
         Earn globally recognized certifications that showcase your expertise to top employers.
        </p>
        </div>
        <hr className="seperater"/>
        <div>
        <p className="key-title-text">
        <img src={key5} alt="Range" className="icon" />  Wide Range of Courses
        </p>
      <p className="instructor-title-text">
         Choose from Cloud, DevOps, Data Science, Cybersecurity, Full Stack, and other in-demand fields.
        </p>
        </div>
        <hr className="seperater"/>
    </div>
    </div>
  );
};

export default WhyChoose;

