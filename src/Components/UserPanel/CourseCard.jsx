import React from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import cardbackground from '../../Assets/course2.png';
import './Home.css';

const CourseCard = ({ heading, month, time, image, course_id, Rating, RatingByPeople }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to render stars based on the rating
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

  // Handle button click to navigate to the dynamic page
  const handleButtonClick = () => {
    navigate(`/qaautomation/${course_id}`); // Navigate to the dynamic route with course_id
  };

  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div className="card-header-div">
        <img src={cardbackground} alt="Card" className="card-image" />
        <img src={image} alt="card-img" className="card-icon" />
      </div>

      <div className="card-course-details">
        <h5 className="course-name">{heading}</h5>
        <div className="course-time">
          <h6 className="course-month">
            <RxCalendar /> {month} Days
          </h6>
          <h6 className="course-month">
            <BiTimeFive /> {time} hours
          </h6>
        </div>

        <h6 className="course-review">
          Rating: {renderStars(Rating)} ({RatingByPeople})
        </h6>

        <div className="new-batch">
          <p className="new-batch-para">
            New Batch: <span> In few days</span>
          </p>
        </div>

        <button
          className="enroll-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering any parent click handler
            handleButtonClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;