import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import imageUrl from '../../Assets/course_card2.png';

const TrainingCard = ({ mode, heading, date, time, duration, image }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const navigateToCourse = () => {
    if (heading) {
      const formattedName = heading.toLowerCase().replace(/\s+/g, '-');
      navigate(`/courseDetails/${formattedName}`);
    }
  };

  return (
    <div
      className="card"
      onClick={isMobile ? navigateToCourse : undefined} // Click on card only for mobile
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && isMobile && navigateToCourse()}
    >
      <div className="card-header-div">
        <img src={imageUrl} alt="Card" className="card-image" />
        <div className="card-header">
          <FaCircle className="card-header-icon" />
          {mode}
        </div>
        {image && <img src={image} alt="card-img" className="card-icon" />}
      </div>
      <div className="card-course-details">
        <div className="mob-card-header">
          <FaCircle className="mob-card-header-icon" />
          {mode}
        </div>
        <h5 className="course-name">{heading}</h5>
        <div className="date-time-container">
          <p className="date">{date}</p>
          <p className="time">{time}</p>
        </div>
        {/* <h6 className="course-date">{duration} Hour</h6> */}
        {/* Prevent event propagation on button click */}
        <button 
          className="enroll-btn" 
          onClick={(e) => { 
            e.stopPropagation(); // Stop click from triggering card event
            navigateToCourse(); 
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TrainingCard;