import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold3Line } from 'react-icons/ri';
import axios from 'axios';
import CourseCard from './CourseCard';
const Trending = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const [courses, setCourses] = useState([]); // Initialize as an empty array
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Fetch categories and courses from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/course-categories/all');
        setCategories([{ name: 'All' }, ...response.data]); // Add "All" option to categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/courses/all');
        setCourses(response.data || []); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCategories();
    fetchCourses();
  }, []);

  // Filter courses based on the active category
  const filteredCourses =
    activeCategory === 'All'
      ? courses
      : courses.filter((course) => course.courseCategory === activeCategory);

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

  // const handleCardClick = (course_id) => {
  //   navigate(`/qaautomation/${course_id}`);
  // };
  const handleCardClick = (course) => {
    if (!course?.courseName) return; // Prevent errors if courseName is undefined
  
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-'); // Convert to slug
    navigate(`/courses/${courseSlug}`); // Navigate with new path
  };
  
  
  return (
    <div className="training-events">
      <div className="training-events-head">
        <h1 className="association-head">Trending Courses</h1>
      </div>
      <div className="view-btn">
        <button className="view-all" onClick={() => navigate('/course')}>
          View All
        </button>
      </div>
      <div className="courses-list">
        {categories.slice(0, 7).map((category) => (
          <h2
            key={category.name}
            className={`course-names ${activeCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategorySelection(category.name)}
            style={{ cursor: 'pointer' }}
          >
            {category.name}
          </h2>
        ))}
        <div className="dropdown-container">
          <RiMenuUnfold3Line className="course-menu" onClick={handleDropdownClick} />
          {dropdownVisible && (
            <div className="dropdown-list">
              {categories.slice(7).map((category) => (
                <div
                  key={category.name}
                  className="dropdown-item"
                  onClick={() => handleCategorySelection(category.name)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="training-card-holder">
        {filteredCourses.slice(0, 4).map((course, index) => (
          <CourseCard
          key={index}
          heading={course.courseName}
          month={course.numberOfClasses}
          time={course.liveTrainingHours}
          image={`https://api.hachion.co/${course.courseImage}`}
          course_id={course.id}
          RatingByPeople={course.ratingByNumberOfPeople}
          Rating={course.starRating}
          onClick={() => handleCardClick(course)} // Pass entire course object
          className="course-card"
        />
        
        ))}
        {showMore &&
          filteredCourses.slice(4).map((course, index) => (
            <CourseCard
  key={index}
  heading={course.courseName}
  month={course.numberOfClasses}
  time={course.liveTrainingHours}
  image={`https://api.hachion.co/${course.courseImage}`}
  course_id={course.id}
  RatingByPeople={course.ratingByNumberOfPeople}
  Rating={course.starRating}
  onClick={() => handleCardClick(course)} // Pass entire course object
  className="course-card"
/>

          ))}
        {filteredCourses.length === 0 && <p>No courses available.</p>}
      </div>
      <button className="cards-view" onClick={toggleShowMore}>
        {showMore ? 'View Less' : 'View More'}
      </button>
    </div>
  );
};

export default Trending;
