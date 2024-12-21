import React from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import './Course.css';
import cardicon from '../../Assets/image 85.png';
import { useNavigate } from 'react-router-dom';

const SidebarCard = ({ title, duration, time, Rating, RatingByPeople }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/qaautomation');
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
    <div className="sidebar-card">
      <div className="sidebar-card-header-div">
        <h4 className="sidebar-card-heading">Certified Students: 0</h4>
        <img src={cardicon} alt="card-img" className="sidebar-card-icon" />
      </div>
      <div className="sidebar-course-details">
        <h5 className="sidebar-course-name">{title}</h5>
        <div className="sidebar-course-time">
          <h6 className="sidebar-course-month">
            <RxCalendar /> {duration} months
          </h6>
          <h6 className="sidebar-course-month">
            <BiTimeFive /> {time} hours
          </h6>
        </div>
        <h6 className="sidebar-course-review">
          Rating: {Rating} {renderStars(Rating)} ({RatingByPeople})
        </h6>
        <button className="sidebar-enroll-btn" onClick={handleClick}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default SidebarCard;
