// import React, { useState, useEffect } from 'react';
// import { RxCalendar } from "react-icons/rx";
// import { BiTimeFive } from "react-icons/bi";
// import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';
// import kidbackground from '../../Assets/kidbanner2.webp';
// import './Home.css';

// const TeensCard = ({ heading, month, time, image, Rating, RatingByPeople, aboutCourse }) => {
//   const navigate = useNavigate(); 
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect if the screen is mobile size
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   // Format course name for URL
//   const formattedName = heading
//   ? heading.toLowerCase().replace(/\s+/g, '-')
//   : '';


//   // Function to navigate to course details
//   const handleNavigation = () => {
//     navigate(`/coursedetails/${formattedName}`);
//   };

//   // Render star ratings
//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) =>
//       i < rating ? (
//         <MdOutlineStar key={i} className="star-icon filled" />
//       ) : (
//         <MdOutlineStarBorder key={i} className="star-icon" />
//       )
//     );
//   };

//   return (
//     <div
//       className="card"
//       style={{ cursor: isMobile ? 'pointer' : 'default' }}
//       onClick={isMobile ? handleNavigation : undefined} // Click only on mobile
//     >
//       <div className="card-header-div">
//         <img src={kidbackground} alt="Kid Card" className="card-image" loading="lazy"/>
//         <img src={image} alt="card-img" className="card-icon" loading="lazy"/>
//       </div>

//       <div className="card-course-details">
//         <h4 className="course-name">{heading}</h4>
//         <div>
//           <p className="course-month">
//             <RxCalendar /> {month} Days
//           </p>
    
//         </div>

//         <p className="course-review">
//           Rating: {renderStars(Rating)} ({RatingByPeople})
//         </p>

//          <div className="new-batch">
//         <p className="new-batch-para">
//           {aboutCourse
//             ? aboutCourse
//             : "Learning a software course helps individuals build and manage applications, solve real-world problems, and succeed in fast-growing, tech-driven industries."}
//         </p>
//       </div>
    
//         {!isMobile && (
//           <button
//             className="enroll-btn"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleNavigation();
//             }}
//           >
//             View Details
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeensCard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbShare3 } from "react-icons/tb";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import fallbackImg from "../../Assets/18.png";
import './Home.css';

const TeensCard = ({ heading, month, discountPercentage, image, trainer_name, level = "All Levels", aboutCourse }) => {
  const navigate = useNavigate(); 
  const [isMobile, setIsMobile] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Detect if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); 
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
      className="card"
      style={{ cursor: isMobile ? 'pointer' : 'default' }}
      onClick={isMobile ? handleNavigation : undefined}
    >
      <div className="card-action-icons">
      <button className="card-icons" onClick={handleShare}><TbShare3 /></button>
      <button className="card-icons" onClick={handleBookmark}>
            {bookmarked ? <MdBookmark className="bookmark-active" /> : <MdBookmarkBorder />}
          </button>
    </div>
      <div className="card-header-div">
        <img src={image} alt="Course-img" className="card-image" loading="lazy"
        onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}/>
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
            {discountPercentage} off
          </div>
        </div>
                <div className="card-row">
        <div className="course-amount">$19.99 <span>$24.99</span></div>
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

export default TeensCard;