// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SidebarCard from "./SidebarCard"; 
// import "./Course.css"; 

// const SidebarRight = ({ category, currentPage, cardsPerPage, onTotalCardsChange }) => {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get("https://api.test.hachion.co/courses/all");
//         if (Array.isArray(response.data)) {
//           setCourses(response.data);
//         } else {
//           setCourses([]);
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error.message);
//         setCourses([]);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // Filter courses based on selected category
//   useEffect(() => {
//     let filtered;
//     if (!category || category.length === 0 || category === "All") {
//       filtered = courses;
//     } else if (Array.isArray(category)) {
//       filtered = courses.filter(c => category.includes(c.courseCategory));
//     } else {
//       filtered = courses.filter(c => c.courseCategory === category);
//     }
//     setFilteredCourses(filtered);

//     // Update total cards for pagination
//     if (onTotalCardsChange) {
//       onTotalCardsChange(filtered.length);
//     }
//   }, [category, courses, onTotalCardsChange]);

//   // Pagination
//   const indexOfLastCard = currentPage * cardsPerPage;
//   const indexOfFirstCard = indexOfLastCard - cardsPerPage;
//   const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

//   return (
//     <div className="course-card-container">
//       {currentCards.length > 0 ? (
//         currentCards.map((course, index) => (
//           <SidebarCard
//             key={course.id || index}
//             heading={course.courseName}
//             image={`https://api.test.hachion.co/${course.courseImage}`}
//             discountPercentage={course.discount}
//             amount={course.itotal}
//             totalAmount={course.iamount}
//             level={course.levels}
//             month={course.numberOfClasses}
//             course_id={course.id}
//           />
//         ))
//       ) : (
//         <p style={{paddingTop:'30px', paddingLeft: '20px'}}>No courses available</p>
//       )}
//     </div>
//   );
// };

// export default SidebarRight;

import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarCard from "./SidebarCard";
import "./Course.css";

const SidebarRight = ({ filters, currentPage, cardsPerPage, onTotalCardsChange }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/courses/all");
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by Category
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((c) => filters.categories.includes(c.courseCategory));
    }

    // Filter by Level
    if (filters.levels && filters.levels.length > 0 && !filters.levels.includes("All Levels")) {
      filtered = filtered.filter((c) => filters.levels.includes(c.levels));
    }

    // Filter by Price
    if (filters.price && filters.price.length > 0) {
      filtered = filtered.filter((c) => {
        const priceType = c.itotal > 0 ? "Paid" : "Free";
        return filters.price.includes(priceType);
      });
    }

    setFilteredCourses(filtered);
    if (onTotalCardsChange) {
      onTotalCardsChange(filtered.length);
    }
  }, [filters, courses, onTotalCardsChange]);

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="course-card-container">
      {currentCards.length > 0 ? (
        currentCards.map((course, index) => (
          <SidebarCard
            key={course.id || index}
            heading={course.courseName}
            image={`https://api.test.hachion.co/${course.courseImage}`}
            discountPercentage={course.discount}
            amount={course.itotal}
            totalAmount={course.iamount}
            level={course.levels}
            month={course.numberOfClasses}
            course_id={course.id}
          />
        ))
      ) : (
        <p style={{ paddingTop: "30px", paddingLeft: "20px" }}>No courses available</p>
      )}
    </div>
  );
};

export default SidebarRight;
