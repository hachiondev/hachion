// import React, { useEffect, useState } from 'react';
// import { RxCalendar } from "react-icons/rx";
// import { BiTimeFive } from "react-icons/bi";
// import './Course.css';
// import fallbackImg from "../../Assets/18.png";
// import { Link, useNavigate } from 'react-router-dom';

// const DropdownCard = ({ title, month, level , image }) => {
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

//   return (
//     <div className="dropdown-card"
//     onClick={handleClick}>
//       <div className="dropdown-card-icon">
//         <img src={image} alt="course-img" loading="lazy"
//         onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = fallbackImg;
//             }}/>
//       </div>
//       <div className="dropdown-course-details">
//         <div className="dropdown-course-time">
//           <span className={`course-badge ${level?.toLowerCase()}`}>
//             {level}
//           </span>
//           <div className="dropdown-card-month">
//             <BiTimeFive /> {month} Days
//           </div>
//         </div>
//         <h3 className="dropdown-course-name">{title}</h3>
//         </div>
//         <button className="dropdown-view-btn" onClick={handleClick}>View Details
//          </button>
//     </div>
//   );
// };

// export default DropdownCard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Course.css";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

const DropdownCourseList = ({ category }) => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("https://api.test.hachion.co/courses/all");
        if (isMounted) setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    if (category && courses.length > 0) {
      const filteredList = courses.filter(
        (course) => course.courseCategory === category
      );
      setFiltered(filteredList);
    }
  }, [category, courses]);

  const handleCourseClick = (title) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  if (loading) {
    return (
      <div className="scrollable-category-list">
        <ul className="category-menu">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <div
                className="skeleton-explore-text title"
                style={{ padding: "4px 8px" }}
              >
                <div className="skeleton-text-line"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (filtered.length === 0)
    return <p className="dropdown-no-courses">No courses in {category}</p>;

  return (
    <div className="scrollable-category-list">
      <ul className="category-menu">
        {filtered.map((course, index) => (
          <li key={course.id || index}>
            <button
              onClick={() => handleCourseClick(course.courseName)}
              className="category-menu-item"
              style={{ padding: "4px 8px", fontWeight: "400" }}
            >
              <div className="category-menu-text">{course.courseName}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownCourseList;
