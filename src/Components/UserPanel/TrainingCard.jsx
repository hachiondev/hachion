// TrainingCard.js
import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import imageUrl from '../../Assets/course_card2.png';

const TrainingCard = ({ mode, heading, date, time, duration, image, scheduleCount }) => {
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
      navigate(`/courseDetails/${formattedName}#upcoming-batch`, {
        state: { scrollTo: 'upcoming-batch' }  // pass scroll target
      });
    }
  };

  return (
    <div
      className="card"
      onClick={isMobile ? navigateToCourse : undefined}
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
          <p className="card-date">{date}</p>
          <p className="time">{time}</p>
        </div>

        <div className="more-schedules">
          <button
            className="enroll-btn"
            onClick={(e) => {
              e.stopPropagation(); 
              navigateToCourse();
            }}
          >
            {scheduleCount > 1 ? `View ${scheduleCount - 1} More Schedules` : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;