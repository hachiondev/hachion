import React, { useEffect, useState, useRef } from "react"; 
import StartInstructor from "../../Assets/e1.webp";
import Teaching from "../../Assets/e2.webp";
import Users from "../../Assets/Users.png";
import Notebook from "../../Assets/Notebook.png";
import Globe from "../../Assets/GlobeHemisphereWest.png";
import CircleWavyCheck from "../../Assets/CircleWavyCheck.png";
import Stack from "../../Assets/Stack.png";
import { FaCheckCircle } from "react-icons/fa";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import "./Home.css";

const statistics = [
  {
    img: Users,
    number: '67.1k',
    label: 'Students',
    alt: "Students"
  },
  {
    img: Notebook,
    number: '26k',
    label: 'Certified Instructor',
    alt: 'Certified Instructor',
  },
  {
    img: Globe,
    number: '72',
    label: 'Country Language',
    alt: 'Country Language',
  },
  {
    img: CircleWavyCheck,
    number: '99.9%',
    label: 'Success Rate',
    alt: 'Success Rate',
  },
   {
    img: Stack,
    number: '57',
    label: 'Trusted Companies',
    alt: 'Trusted Companies',
  },
];
const ExpertStatistic = ({ img, number, label, alt }) => (
  <div className='expert-content'>
    <img src={img} alt={alt} />
    <div className='expert-sub-content'>
    <div className='expert-number'>{number}</div>
    <p className='expert-label'>{label}</p>
  </div>
  </div>
);

const BecomeInstructor = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll button logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-background">
      <Topbar />
      <NavbarTop />

      {/* Banner Section */}
      <div className="home-banner container">
        <div className="home-content">
          <h1 className="home-title">
           Become an Instuctor
          </h1>
          <p className="home-title-text">
           Become an instructor & start teaching with 26k certified instructors. Create a success story with 67.1k Students — Grow yourself with 71 countries.
          </p>
          <div className="button-row">
            <button className="home-start-button" >Get Started</button>
          </div>
        </div>
        <img
          className="home-banner-img"
          src={StartInstructor}
          alt="Learner feedback banner"
          fetchpriority="high"
        />
      </div>
      <div className='expert-statistics'>
            {statistics.map((stat, idx) => (
              <ExpertStatistic key={idx} {...stat} />
            ))}
          </div>

          <div className="instructor-banner container">
                {/* Left side content */}
                <div className="home-content">
                  
                  <img
                  src={Teaching}
                  alt="Teaching banner"
                  className="key-image"
                  fetchpriority="high"
                />
                  </div>
          
                {/* Right side content */}
                <div className="home-content">
                    <h2 className="association-head">Why you’ll start teaching on Hachion</h2>
                  <p className="home-title-text">
                    Advance your career with Hachion’s expert-led IT training, trusted by learners worldwide for its unique features.
                  </p>
                  <div className='expert-points'>
                  <FaCheckCircle className="check-icon" />
                  <div className='expert-sub-content'>
                  <h3 className="teaching-title-text">
                    Teach your students as you want.
                  </h3>
                <p className="help-faq-details">
                   Gain knowledge from professionals with real-world experience. Learn insights, tips, and strategies used by industry leaders.
                  </p>
                  </div>
                  </div>
                  <div className='expert-points'>
                    <FaCheckCircle className="check-icon" />
                    <div className='expert-sub-content'>
                  <h3 className="teaching-title-text">
                   Manage your course, payment in one place
                  </h3>
                <p className="help-faq-details">
                  Learn at your own pace with self-paced modules or live interactive classes that fit your schedule.
                  </p>
                  </div>
                  </div>
                  <div className='expert-points'>
                    <FaCheckCircle className="check-icon" />
                    <div className='expert-sub-content'>
                  <h3 className="teaching-title-text">
                    Chat with your students
                  </h3>
                <p className="help-faq-details">
                  Practice through real projects, assignments, and peer discussions for stronger skill retention.
                  </p>
                  </div>
                  </div>
              </div>
              </div>

      <Footer />
      {showScrollButton && <StickyBar />}
    </div>
  );
};

export default BecomeInstructor;
