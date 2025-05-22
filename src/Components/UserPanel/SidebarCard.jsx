import React, { useEffect, useState } from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import './Course.css';
import { useNavigate } from 'react-router-dom';

const SidebarCard = ({ title, month, time, Rating, RatingByPeople, image, student }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 760);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle button click to navigate
  const handleClick = () => {
    if (title) {
      const formattedName = title.toLowerCase().replace(/\s+/g, '-'); // Format course name
      navigate(`/courseDetails/${formattedName}`);
    }
  };

  // Function to render stars dynamically based on the rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <MdOutlineStar key={i} className="star-icon filled" />
        ) : (
          <MdOutlineStarBorder key={i} className="star-icon" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="sidebar-card"
    onClick={isMobile ? handleClick : undefined} >
      <div className="sidebar-card-header-div">
        <p className="sidebar-card-heading">Certified Students: {student}</p>
        <img src={image} alt="card-img" className="sidebar-card-icon" />
      </div>
      <div className="sidebar-course-details">
        <h3 className="sidebar-course-name">{title}</h3>
        <div className="sidebar-course-time">
          <p className="sidebar-course-month">
            <RxCalendar /> {month} Days
          </p>
          {/* <p className="sidebar-course-month">
            <BiTimeFive /> {time} Hours
          </p> */}
        </div>
        <p className="sidebar-course-review">
          Rating: {Rating} {renderStars(Rating)} ({RatingByPeople})
        </p>
        <button className="sidebar-enroll-btn" onClick={(e) => {
          e.stopPropagation(); // Prevent parent click event
          handleClick();
        }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default SidebarCard;