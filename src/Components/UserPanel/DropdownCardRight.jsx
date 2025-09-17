// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DropdownCard from "./DropdownCard";
// import "./Course.css";

// const DropdownCardRight = ({ category, currentPage, cardsPerPage }) => {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);

//   // Fetch courses from the API
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get("https://api.test.hachion.co/courses/all");
//         if (Array.isArray(response.data)) {
//           setCourses(response.data); // Set the courses if data is an array
//         } else {
//           console.error("Unexpected API response format:", response.data);
//           setCourses([]); // Fallback to an empty array
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error.message);
//         setCourses([]); // Fallback to an empty array
//       }
//     };
  
//     fetchCourses();
//   }, []);

//   // Filter courses based on the selected category
//   useEffect(() => {
//     if (category === "All") {
//       setFilteredCourses(courses);
//     } else {
//       const filtered = courses.filter(
//         (course) => course.courseCategory === category
//       );
//       setFilteredCourses(filtered);
//     }
//   }, [category, courses]);

//   // Calculate pagination
//   const indexOfLastCard = currentPage * cardsPerPage;
//   const indexOfFirstCard = indexOfLastCard - cardsPerPage;
//   const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

//   return (
//     <div className="course-card-container">
//    {currentCards.length > 0 ? (
//     currentCards.map((course, index) => (
//       <DropdownCard
//         key={course.id || index}
//         title={course.courseName}
//         RatingByPeople={course.ratingByNumberOfPeople}
//         image={`https://api.test.hachion.co/${course.courseImage}`} // Correct property
//         Rating={course.starRating}
//         student={course.totalEnrollment}
//         month={course.numberOfClasses}
//         time={course.liveTrainingHours}
//         course_id={course.id}
//       />
//     ))
//   ): (
//     <p style={{paddingTop:'30px', paddingLeft: '20px'}}>No courses available</p>
//       )}
//     </div>
//   );
// };

// // Function to get total number of cards (for pagination purposes)
// export const getTotalCards = (category, courses = []) => {
//   if (!courses) return 0; // Handle undefined courses
//   if (category === "All") {
//     return courses.length;
//   }
//   return courses.filter((course) => course.courseCategory === category).length;
// };

// export default DropdownCardRight;

import React, { useState, useEffect } from "react";
import axios from "axios";
import DropdownCard from "./DropdownCard";
import "./Course.css";

const DropdownCardRight = ({ category, currentPage, cardsPerPage }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/courses/all");
        if (Array.isArray(response.data)) {
          setCourses(response.data); // Set the courses if data is an array
        } else {
          console.error("Unexpected API response format:", response.data);
          setCourses([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        setCourses([]); // Fallback to an empty array
      }
    };
  
    fetchCourses();
  }, []);

  // Filter courses based on the selected category
  useEffect(() => {
    if (category === "All") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) => course.courseCategory === category
      );
      setFilteredCourses(filtered);
    }
  }, [category, courses]);

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="course-card-container">
   {currentCards.length > 0 ? (
    currentCards.map((course, index) => (
      <DropdownCard
        key={course.id || index}
        title={course.courseName}
        image={`https://api.test.hachion.co/${course.courseImage}`}
        level={course.level}
        month={course.numberOfClasses}
        course_id={course.id}
      />
    ))
  ): (
    <p style={{paddingTop:'30px', paddingLeft: '20px'}}>No courses available</p>
      )}
    </div>
  );
};

// Function to get total number of cards (for pagination purposes)
export const getTotalCards = (category, courses = []) => {
  if (!courses) return 0; // Handle undefined courses
  if (category === "All") {
    return courses.length;
  }
  return courses.filter((course) => course.courseCategory === category).length;
};

export default DropdownCardRight;