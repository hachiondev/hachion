import React, { useState, useEffect } from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import cardbackground from '../../Assets/course2.webp';
import './Home.css';

const CourseCard = ({ heading, month, time, image, Rating, RatingByPeople, aboutCourse }) => {
  const navigate = useNavigate(); 
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Format course name for URL
  const formattedName = heading
  ? heading.toLowerCase().replace(/\s+/g, '-')
  : '';


  // Function to navigate to course details
  const handleNavigation = () => {
    navigate(`/coursedetails/${formattedName}`);
  };

  // Render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <MdOutlineStar key={i} className="star-icon filled" />
      ) : (
        <MdOutlineStarBorder key={i} className="star-icon" />
      )
    );
  };

  return (
    <div
      className="card"
      style={{ cursor: isMobile ? 'pointer' : 'default' }}
      onClick={isMobile ? handleNavigation : undefined} // Click only on mobile
    >
      <div className="card-header-div">
        <img src={cardbackground} alt="Card" className="card-image" loading="lazy"/>
        <img src={image} alt="card-img" className="card-icon" loading="lazy"/>
      </div>

      <div className="card-course-details">
        <h3 className="course-name">{heading}</h3>
        <div>
          <p className="course-month">
            <RxCalendar /> {month} Days
          </p>
    
        </div>

        <p className="course-review">
          Rating: {renderStars(Rating)} ({RatingByPeople})
        </p>

        <div className="new-batch">
        <p className="new-batch-para">
          {aboutCourse
            ? aboutCourse
            : "Learning a software course helps individuals build and manage applications, solve real-world problems, and succeed in fast-growing, tech-driven industries."}
        </p>
      </div>
    
        {!isMobile && (
          <button
            className="enroll-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;