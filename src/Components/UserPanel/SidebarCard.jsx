// import React, { useEffect, useState } from 'react';
// import { RxCalendar } from "react-icons/rx";
// import { BiTimeFive } from "react-icons/bi";
// import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
// import './Course.css';
// import { useNavigate } from 'react-router-dom';

// const SidebarCard = ({ title, month, time, Rating, RatingByPeople, image, student }) => {
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 760);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Handle button click to navigate
//   const handleClick = () => {
//     if (title) {
//       const formattedName = title.toLowerCase().replace(/\s+/g, '-'); // Format course name
//       navigate(`/coursedetails/${formattedName}`);
//     }
//   };

//   // Function to render stars dynamically based on the rating
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         i <= rating ? (
//           <MdOutlineStar key={i} className="star-icon filled" />
//         ) : (
//           <MdOutlineStarBorder key={i} className="star-icon" />
//         )
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="sidebar-card"
//     onClick={isMobile ? handleClick : undefined} >
//       <div className="sidebar-card-header-div">
//         <p className="sidebar-card-heading">Certified Students: {student}</p>
//         <img src={image} alt="card-img" className="sidebar-card-icon" loading="lazy"/>
//       </div>
//       <div className="sidebar-course-details">
//         <h3 className="sidebar-course-name">{title}</h3>
//         <div className="sidebar-course-time">
//           <p className="sidebar-course-month">
//             <RxCalendar /> {month} Days
//           </p>
//           {/* <p className="sidebar-course-month">
//             <BiTimeFive /> {time} Hours
//           </p> */}
//         </div>
//         <p className="sidebar-course-review">
//           Rating: {Rating} {renderStars(Rating)} ({RatingByPeople})
//         </p>
//         <button className="sidebar-enroll-btn" onClick={(e) => {
//           e.stopPropagation(); // Prevent parent click event
//           handleClick();
//         }}>
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SidebarCard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbShare3 } from "react-icons/tb";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import fallbackImg from "../../Assets/18.png";
import './Home.css';

const SidebarCard = ({ heading, month, discountPercentage, image, trainer_name, level = "All Levels", amount, totalAmount }) => {
  const navigate = useNavigate(); 
  const [isMobile, setIsMobile] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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

// Function to handle share
const handleShare = async (e) => {
  e.stopPropagation();
  const courseUrl = `${window.location.origin}/coursedetails/${formattedName}`;
  const shareMessage = `Check this course details to gain more knowledge on this: ${heading}`;

  try {
    if (navigator.canShare && navigator.canShare({ files: [] })) {
      // Mobile native share with image
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "course-image.jpg", { type: blob.type });

      await navigator.share({
        title: heading,
        text: shareMessage,
        url: courseUrl,
        files: [file],
      });
    } else if (navigator.share) {
      // Basic native share (no image)
      await navigator.share({
        title: heading,
        text: shareMessage,
        url: courseUrl,
      });
    } else {
      // ✅ Fallback: open social media share instead of copying text
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage + " " + courseUrl)}`;
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`;

      // Example: open WhatsApp share
      window.open(whatsappUrl, "_blank");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <div
      className="sidebar-card"
      style={{ cursor: isMobile ? 'pointer' : 'default' }}
      onClick={isMobile ? handleNavigation : undefined}
    >
      <div className="card-action-icons">
      <button className="card-icons" onClick={handleShare} aria-label="Share this course"><TbShare3 /></button>
      <button className="card-icons" onClick={handleBookmark} 
      aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
            {bookmarked ? <MdBookmark className="bookmark-active" /> : <MdBookmarkBorder />}
          </button>
    </div>
      <div className="card-header-div">
        <img src={image} alt="Course-img" className="card-image" loading="lazy"
        onError={(e) => {
      e.target.onerror = null;
      e.target.src = fallbackImg;
    }}/>
        {/* <img src={image} alt="card-img" className="card-icon" loading="lazy"/> */}
      
      </div>

      <div className="card-course-details">
        <div className="card-row">
          <div className="dropdown-course-month">
           {month} Days
          </div>
          <div className={`course-badge ${level?.toLowerCase()}`}>
            {level}
          </div>
          <div className="trainer-name">
            By {trainer_name}
          </div>
        </div>
        <div className="card-row">
        <h3 className="course-name">{heading}</h3>
        <div className="discount-lable">
            {discountPercentage}% off
          </div>
        </div>
                <div className="card-row">
        <div className="course-amount">INR {amount} <span>INR {totalAmount}</span></div>
        <div className="discount-duration">
            11:59 Sec Left
          </div>
        </div>
    
        <button className="card-view-btn" onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}>View Details
         </button>
      </div>
    </div>
  );
};

export default SidebarCard;