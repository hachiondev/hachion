import React, { useEffect, useState } from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import './Course.css';
import { useNavigate } from 'react-router-dom';

const DropdownCard = ({ title, month, time, Rating, RatingByPeople, image, student }) => {
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
      navigate(`/coursedetails/${formattedName}`);
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
    <div className="dropdown-card"
    onClick={handleClick}>
      <div className="dropdown-card-header-div">
        <img src={image} alt="card-img" className="dropdown-card-icon" loading="lazy"/>
      </div>
      <div className="dropdown-course-details">
        <h3 className="dropdown-course-name">{title}</h3>
        <div className="dropdown-course-time">
          <p className="dropdown-course-month">
            <RxCalendar /> {month} Days
          </p>
        </div>
        <p className="dropdown-course-review">
          Rating: {Rating} {renderStars(Rating)} ({RatingByPeople})
        </p>
      </div>
    </div>
  );
};

export default DropdownCard;