// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { RiMenuUnfold3Line } from 'react-icons/ri';
// import axios from 'axios';
// import CourseCard from './CourseCard';
// import './Home.css';

// const Trending = () => {
//   const navigate = useNavigate();
//   const [trendingCourses, setTrendingCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   useEffect(() => {
//     const fetchTrendingCourses = async () => {
//       try {
//         // Fetch trending courses
//         const trendingResponse = await axios.get('https://api.hachion.co/trendingcourse');
//         const trendingData = trendingResponse.data || [];

//         // Filter courses with status: true
//         const activeTrendingCourses = trendingData.filter(course => course.status);

//         // Fetch all courses to get detailed information
//         const allCoursesResponse = await axios.get('https://api.hachion.co/courses/all');
//         const allCourses = allCoursesResponse.data || [];

//         // Map active trending courses to include detailed info
//         const detailedTrendingCourses = activeTrendingCourses.map(trendingCourse => {
//           const courseDetails = allCourses.find(course => course.courseName === trendingCourse.course_name);
//           return {
//             ...trendingCourse,
//             ...courseDetails,
//           };
//         });

//         // Extract unique categories from the active trending courses
//         const uniqueCategories = [
//           'All',
//           ...new Set(detailedTrendingCourses.map(course => course.category_name)),
//         ];
//         setCategories(uniqueCategories);
//         setTrendingCourses(detailedTrendingCourses);
//       } catch (error) {
//         console.error('Error fetching trending courses:', error);
//       }
//     };

//     fetchTrendingCourses();
//   }, []);

//   // Filter courses based on the active category
//   const filteredCourses =
//     activeCategory === 'All'
//       ? trendingCourses
//       : trendingCourses.filter((course) => course.category_name === activeCategory);

//   const handleDropdownClick = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleCategorySelection = (categoryName) => {
//     setActiveCategory(categoryName);
//     setDropdownVisible(false);
//   };

//   const toggleShowMore = () => {
//     setShowMore(!showMore);
//   };

//   const handleCardClick = (course) => {
//     if (!course?.courseName) return; // Prevent errors if courseName is undefined
//     const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-'); // Convert to slug
//     navigate(`/courseDetails/${courseSlug}`); // Navigate with new path
//   };

//   return (
//     <div className="training-events">
//       <div className="training-events-head-upcoming">
//         <h1 className="association-head">Trending Courses</h1>
//       </div>
//       <div className="view-btn">
//         <button className="view-all" onClick={() => navigate('/courseDetails')}>
//           View All
//         </button>
//       </div>

//       {/* Categories List */}
//       <div className="courses-list">
//         {categories.slice(0, 6).map((category) => (
//           <h2
//             key={category}
//             className={`course-names ${activeCategory === category ? 'active' : ''}`}
//             onClick={() => handleCategorySelection(category)}
//             style={{ cursor: 'pointer' }}
//           >
//             {category}
//           </h2>
//         ))}

//         {categories.length > 6 && (
//           <div className="dropdown-container">
//             <RiMenuUnfold3Line className="course-menu" onClick={handleDropdownClick} />
//             {dropdownVisible && (
//               <div className="dropdown-list">
//                 {categories.slice(6).map((category) => (
//                   <div
//                     key={category}
//                     className="dropdown-item"
//                     onClick={() => handleCategorySelection(category)}
//                   >
//                     {category}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Course Cards */}
//       <div className="training-card-holder">
//         {filteredCourses.slice(0, showMore ? filteredCourses.length : 4).map((course, index) => (
//           <CourseCard
//             key={index}
//             heading={course.courseName}
//             month={course.numberOfClasses}
//             time={course.liveTrainingHours}
//             image={`https://api.hachion.co/${course.courseImage}`}
//             course_id={course.id}
//             RatingByPeople={course.ratingByNumberOfPeople}
//             Rating={course.starRating}
//             onClick={() => handleCardClick(course)}
//             className="course-card"
//           />
//         ))}

//         {filteredCourses.length === 0 && <p>No courses available.</p>}
//       </div>

//       {filteredCourses.length > 4 && (
//         <button className="cards-view" onClick={toggleShowMore}>
//           {showMore ? 'View Less' : 'View More'}
//         </button>
//       )}
//     </div>
//   );
// };

// export default Trending;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { RiMenuUnfold3Line } from 'react-icons/ri';
// import axios from 'axios';
// import CourseCard from './CourseCard';
// import './Home.css';

// const Trending = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [showMore, setShowMore] = useState(false);
//   const [topCategories, setTopCategories] = useState([]);
//   const [dropdownCategories, setDropdownCategories] = useState([]);

//   // Fetch categories and courses from the API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('https://api.hachion.co/trendingcourse');
//         const allCategories = [{ name: 'All' }, ...response.data];
//         setCategories(allCategories);
//         setTopCategories(allCategories.slice(0, 6));
//         setDropdownCategories(allCategories.slice(7));
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get('https://api.hachion.co/courses/all');
//         setCourses(response.data || []);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       }
//     };

//     fetchCategories();
//     fetchCourses();
//   }, []);

//   // Filter courses based on the active category
//   const filteredCourses =
//     activeCategory === 'All'
//       ? courses
//       : courses.filter((course) => course.courseCategory === activeCategory);

//   const handleDropdownClick = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleCategorySelection = (categoryName) => {
//     setActiveCategory(categoryName);

//     // Swap the selected category from dropdown with a category from the top menu
//     if (dropdownCategories.some((c) => c.name === categoryName)) {
//       const newDropdown = [...dropdownCategories.filter((c) => c.name !== categoryName)];
//       const replacedCategory = topCategories[topCategories.length - 1]; // Get last category from top

//       setDropdownCategories([...newDropdown, replacedCategory]); // Move replaced category to dropdown
//       setTopCategories([...topCategories.slice(0, 6), { name: categoryName }]); // Replace with selected category
//     }

//     setDropdownVisible(false); // Close dropdown after selection
//   };

//   const toggleShowMore = () => {
//     setShowMore(!showMore);
//   };

//   const handleCardClick = (course) => {
//     if (!course?.courseName) return; // Prevent errors if courseName is undefined

//     const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-'); // Convert to slug
//     navigate(`/courseDetails/${courseSlug}`); // Navigate with new path
//   };

//   return (
//     <div className="training-events">
//       <div className="training-events-head">
//         <h1 className="association-head">Trending Courses</h1>
//       </div>
//       <div className="view-btn">
//       <button className="view-all" onClick={() => navigate('/courseDetails')}>
//           View All
//         </button>
//       </div>

//       {/* Desktop View: Display categories in top menu and dropdown */}
//       <div className="courses-list">
//         {topCategories.map((category) => (
//           <h2
//             key={category.name}
//             className={`course-names ${activeCategory === category.name ? 'active' : ''}`}
//             onClick={() => handleCategorySelection(category.name)}
//             style={{ cursor: 'pointer' }}
//           >
//             {category.name}
//           </h2>
//         ))}

//         <div className="dropdown-container">
//           <RiMenuUnfold3Line className="course-menu" onClick={handleDropdownClick} />
//           {dropdownVisible && (
//             <div className="dropdown-list">
//               {dropdownCategories.map((category) => (
//                 <div
//                   key={category.name}
//                   className="dropdown-item"
//                   onClick={() => handleCategorySelection(category.name)}
//                 >
//                   {category.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile View: Display course title and menu icon below "Trending Courses" and "View All" */}
//       <div className="course-title-container">
//         <h1 className="course-title">
//           {activeCategory} {/* Dynamically shows the selected course */}
//         </h1>
//         <div className="mobile-dropdown-container">
//           <RiMenuUnfold3Line className="course-menu-icon" onClick={handleDropdownClick} />
//           {dropdownVisible && (
//             <div className="mobile-dropdown-list">
//               {categories
//                 .filter((category) => category.name !== activeCategory)
//                 .map((category) => (
//                   <div
//                     key={category.name}
//                     className="mobile-dropdown-item"
//                     onClick={() => handleCategorySelection(category.name)}
//                   >
//                     {category.name}
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Displaying Course Cards */}
//       <div className="training-card-holder">
//         {filteredCourses.slice(0, 4).map((course, index) => (
//           <CourseCard
//             key={index}
//             heading={course.courseName}
//             month={course.numberOfClasses}
//             time={course.liveTrainingHours}
//             image={`https://api.hachion.co/${course.courseImage}`}
//             course_id={course.id}
//             RatingByPeople={course.ratingByNumberOfPeople}
//             Rating={course.starRating}
//             onClick={() => handleCardClick(course)} // Pass entire course object
//             className="course-card"
//           />
//         ))}

//         {showMore &&
//           filteredCourses.slice(4).map((course, index) => (
//             <CourseCard
//               key={index}
//               heading={course.courseName}
//               month={course.numberOfClasses}
//               time={course.liveTrainingHours}
//               image={`https://api.hachion.co/${course.courseImage}`}
//               course_id={course.id}
//               RatingByPeople={course.ratingByNumberOfPeople}
//               Rating={course.starRating}
//               onClick={() => handleCardClick(course)} // Pass entire course object
//               className="course-card"
//             />
//           ))}

//         {filteredCourses.length === 0 && <p>No courses available.</p>}
//       </div>

//       <button className="cards-view" onClick={toggleShowMore}>
//         {showMore ? 'View Less' : 'View More'}
//       </button>
//     </div>
//   );
// };

// export default Trending;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiMenuUnfold3Line } from "react-icons/ri";
import axios from "axios";
import CourseCard from "./CourseCard";
import "./Home.css";

const Trending = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [topCount, setTopCount] = useState(() => {
    const width = window.innerWidth;
    if (width <= 768) return 0; // Mobile
    if (width <= 1024) return 4; // Tablet
    return 6; // Desktop
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) setTopCount(0);
      else if (width <= 1024) setTopCount(4);
      else setTopCount(6);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const trendingResponse = await axios.get(
          "https://api.hachion.co/trendingcourse"
        );
        const trendingData = trendingResponse.data || [];

        const activeTrendingCourses = trendingData.filter(
          (course) => course.status
        );

        const allCoursesResponse = await axios.get(
          "https://api.hachion.co/courses/all"
        );
        const allCourses = allCoursesResponse.data || [];

        const detailedTrendingCourses = activeTrendingCourses.map(
          (trendingCourse) => {
            const courseDetails = allCourses.find(
              (course) => course.courseName === trendingCourse.course_name
            );
            return {
              ...trendingCourse,
              ...courseDetails,
            };
          }
        );

        const uniqueCategories = [
          "All",
          ...new Set(
            detailedTrendingCourses.map((course) => course.category_name)
          ),
        ];

        setCategories(uniqueCategories);
        setTrendingCourses(detailedTrendingCourses);
      } catch (error) {
        console.error("Error fetching trending courses:", error);
      }
    };

    fetchTrendingCourses();
  }, []);

  const filteredCourses =
    activeCategory === "All"
      ? trendingCourses
      : trendingCourses.filter(
          (course) => course.category_name === activeCategory
        );

  const handleDropdownClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCategorySelection = (categoryName) => {
    setActiveCategory(categoryName);
    setDropdownVisible(false);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/courseDetails/${courseSlug}`);
  };

  return (
    <div className="training-events">
      <div className="training-events-head-upcoming">
        <h1 className="association-head">Trending Courses</h1>
      </div>

      <div className="view-btn">
        <button className="view-all" onClick={() => navigate("/courseDetails")}>
          View All
        </button>
      </div>

      {/* Top Categories */}
      {topCount > 0 && (
        <div className="courses-list">
          {categories.slice(0, topCount).map((category) => (
            <h2
              key={category}
              className={`course-names ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategorySelection(category)}
              style={{ cursor: "pointer" }}
            >
              {category}
            </h2>
          ))}

          {categories.length > topCount && (
            <div className="dropdown-container">
              <RiMenuUnfold3Line
                className="course-menu"
                onClick={handleDropdownClick}
              />
              {dropdownVisible && (
                <div className="dropdown-list">
                  {categories.slice(topCount).map((category) => (
                    <div
                      key={category}
                      className="dropdown-item"
                      onClick={() => handleCategorySelection(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Dropdown */}
      {topCount === 0 && (
        <div className="course-title-container">
          <h1 className="course-title">{activeCategory}</h1>
          <div className="mobile-dropdown-container">
            <RiMenuUnfold3Line
              className="course-menu-icon"
              onClick={handleDropdownClick}
            />
            {dropdownVisible && (
              <div className="mobile-dropdown-list">
                {categories
                  .filter((category) => category !== activeCategory)
                  .map((category) => (
                    <div
                      key={category}
                      className="mobile-dropdown-item"
                      onClick={() => handleCategorySelection(category)}
                    >
                      {category}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Courses */}
      <div className="training-card-holder">
        {filteredCourses
          .slice(0, showMore ? filteredCourses.length : 4)
          .map((course, index) => (
            <CourseCard
              key={index}
              heading={course.courseName}
              month={course.numberOfClasses}
              time={course.liveTrainingHours}
              image={`https://api.hachion.co/${course.courseImage}`}
              course_id={course.id}
              RatingByPeople={course.ratingByNumberOfPeople}
              Rating={course.starRating}
              onClick={() => handleCardClick(course)}
              className="course-card"
            />
          ))}
        {filteredCourses.length === 0 && <p>No courses available.</p>}
      </div>

      {filteredCourses.length > 4 && (
        <button className="cards-view" onClick={toggleShowMore}>
          {showMore ? "View Less" : "View More"}
        </button>
      )}
    </div>
  );
};

export default Trending;
