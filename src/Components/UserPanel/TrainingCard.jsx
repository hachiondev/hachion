// import React, { useEffect, useState } from 'react';
// import './Home.css';
// import { FaCircle } from "react-icons/fa";
// import imageUrl from '../../Assets/course_card2.png';
// import { useNavigate } from 'react-router-dom';

// const TrainingCard = (props) => {
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);

//   // Check screen size to determine mobile or desktop view
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768); // Define breakpoint for mobile
//     };

//     handleResize(); // Set initial value
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const handleCardClick = () => {
//     if (isMobile && props.heading) {
//       const formattedName = props.heading.toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
//       navigate(`/courses/${formattedName}`);
//     }
//   };

//   const handleButtonClick = (e) => {
//     e.stopPropagation(); // Prevents triggering card click
//     if (props.heading) {
//       const formattedName = props.heading.toLowerCase().replace(/\s+/g, '-');
//       navigate(`/courses/${formattedName}`);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && isMobile) {
//       handleCardClick();
//     }
//   };

//   return (
//     <div
//       className="card"
//       onClick={handleCardClick}
//       role="button"
//       tabIndex={0}
//       onKeyDown={handleKeyDown}
//     >
//       <div className="card-header-div">
//         <img src={imageUrl} alt="Card" className="card-image" />
//         <div className="card-header">
//           <FaCircle className="card-header-icon" />
//           {props.mode} {/* Dynamically display schedule_mode */}
//         </div>
//         <img src={props.image} alt="card-img" className="card-icon" />
//       </div>
//       <div className="card-course-details">
//         <div className="mob-card-header">
//           <FaCircle className="mob-card-header-icon" />
//           {props.mode}
//         </div>
//         <h5 className="course-name">{props.heading}</h5>
//         <div className="course-time">
//           <h6 className="course-date">{props.date}</h6>
//           <h6 className="course-date">{props.time}</h6>
//         </div>
//         <h6 className="course-date">{props.duration}</h6>
//         <button
//           className="enroll-btn"
//           onClick={handleButtonClick}
//         >
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TrainingCard;
import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import imageUrl from '../../Assets/course_card2.png';

const TrainingCard = ({ mode, heading, date, time, duration, image }) => {
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
      navigate(`/courses/${formattedName}`);
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
        <div className="course-time">
          <h6 className="course-date">{date}</h6>
          <h6 className="course-date">{time}</h6>
        </div>
        <h6 className="course-date">{duration}</h6>
        <button className="enroll-btn" onClick={(e) => { e.stopPropagation(); navigateToCourse(); }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default TrainingCard;
