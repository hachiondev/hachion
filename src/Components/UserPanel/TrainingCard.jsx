import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaCircle } from "react-icons/fa";
import imageUrl from '../../Assets/course_card2.png';
import { useNavigate } from 'react-router-dom';

const TrainingCard = (props) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to determine mobile or desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Define breakpoint for mobile
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCardClick = () => {
    if (isMobile) {
      navigate(`/qaautomation/${props.id}`);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); 
    navigate(`/qaautomation/${props.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isMobile) {
      handleCardClick();
    }
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="card-header-div">
        <img src={imageUrl} alt="Card" className="card-image" />
        <div className="card-header">
        <FaCircle className="card-header-icon" />
            {props.mode} {/* Dynamically display schedule_mode */}
          </div>
          <img src={props.image} 
          alt="card-img" className="card-icon" />
        </div>
        <div className="card-course-details">
          <div className="mob-card-header">
            <FaCircle className="mob-card-header-icon" />
            {props.mode} {/* Dynamically display schedule_mode */}
          </div>
        <h5 className="course-name">{props.heading}</h5>
        <div className="course-time">
          <h6 className="course-date">{props.date}</h6>
          <h6 className="course-date">{props.time}</h6>
        </div>
        <h6 className="course-date">{props.duration}</h6>
        <button
          className="enroll-btn"
          onClick={handleButtonClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TrainingCard;
