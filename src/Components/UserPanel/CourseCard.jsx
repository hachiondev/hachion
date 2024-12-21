import React from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import cardbackground from '../../Assets/course2.png';
import './Home.css';

const CourseCard = ({ heading, month, time, image, onClick, Rating, RatingByPeople }) => {
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

  return (
    <>
      <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="card-header-div">
          <img src={cardbackground} alt="Card" className="card-image" />
          <img src={image} alt="card-img" className="card-icon" />
        </div>

        <div className="card-course-details">
          <h5 className="course-name">{heading}</h5>
          <div className="course-time">
            <h6 className="course-month">
              <RxCalendar /> {month}
            </h6>
            <h6 className="course-month">
              <BiTimeFive /> {time} hours
            </h6>
          </div>

          <h6 className="course-review">
            Rating: {renderStars(Rating)} {RatingByPeople}({Rating})
          </h6>

          <div className="new-batch">
            <p className="new-batch-para">
              New Batch: <span> In 5 days (4th Aug)</span>
            </p>
          </div>

          <button className="enroll-btn">View Details</button>
        </div>
      </div>
    </>
  );
};

export default CourseCard;
