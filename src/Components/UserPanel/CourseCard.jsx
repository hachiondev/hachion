import React, { useState, useEffect } from "react";
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import cardbackground from "../../Assets/course2.png";
import "./Home.css";

const CourseCard = ({
  heading,
  month,
  time,
  image,
  Rating,
  RatingByPeople,
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Format course name for URL
  const formattedName = heading
    ? heading.toLowerCase().replace(/\s+/g, "-")
    : "";

  // Function to navigate to course details
  const handleNavigation = () => {
    navigate(`/Coursedetails/${formattedName}`);
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
      style={{ cursor: isMobile ? "pointer" : "default" }}
      onClick={isMobile ? handleNavigation : undefined} // Click only on mobile
    >
      <div className="card-header-div">
        <img src={cardbackground} alt="Card" className="card-image" />
        <img src={image} alt="card-img" className="card-icon" />
      </div>

      <div className="card-course-details">
        <h5 className="course-name">{heading}</h5>
        <div className="course-name">
          <h6 className="course-month">
            <RxCalendar /> {month} Days
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
