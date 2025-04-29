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

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        // Fetch trending courses
        const trendingResponse = await axios.get(
          "https://api.hachion.co/trendingcourse"
        );
        const trendingData = trendingResponse.data || [];

        // Filter courses with status: true
        const activeTrendingCourses = trendingData.filter(
          (course) => course.status
        );

        // Fetch all courses to get detailed information
        const allCoursesResponse = await axios.get(
          "https://api.hachion.co/courses/all"
        );
        const allCourses = allCoursesResponse.data || [];

        // Map active trending courses to include detailed info
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

        // Extract unique categories from the active trending courses
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

  // Filter courses based on the active category
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
    if (!course?.courseName) return; // Prevent errors if courseName is undefined
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-"); // Convert to slug
    navigate(`/courseDetails/${courseSlug}`); // Navigate with new path
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

      {/* Categories List */}
      <div className="courses-list">
        {categories.slice(0, 6).map((category) => (
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

        {categories.length > 6 && (
          <div className="dropdown-container">
            <RiMenuUnfold3Line
              className="course-menu"
              onClick={handleDropdownClick}
            />
            {dropdownVisible && (
              <div className="dropdown-list">
                {categories.slice(6).map((category) => (
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

      {/* Course Cards */}
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
