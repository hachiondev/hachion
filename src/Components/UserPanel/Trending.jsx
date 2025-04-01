import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold3Line } from 'react-icons/ri';
import axios from 'axios';
import CourseCard from './CourseCard';
import './Home.css';

const Trending = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const [courses, setCourses] = useState([]); // Initialize as an empty array
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [topCategories, setTopCategories] = useState([]); // Store the top 7 categories for desktop view
  const [dropdownCategories, setDropdownCategories] = useState([]); // Store the remaining categories for dropdown

  // Fetch categories and courses from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/course-categories/all');
        const allCategories = [{ name: 'All' }, ...response.data]; // Add "All" option to categories
        setCategories(allCategories);
        setTopCategories(allCategories.slice(0, 6)); // Set top 7 categories for desktop
        setDropdownCategories(allCategories.slice(6)); // Set remaining categories for dropdown
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
    
    // Swap the selected category from dropdown with a category from the top menu
    if (dropdownCategories.some((c) => c.name === categoryName)) {
      const newDropdown = [...dropdownCategories.filter((c) => c.name !== categoryName)];
      const replacedCategory = topCategories[topCategories.length - 1]; // Get last category from top

      setDropdownCategories([...newDropdown, replacedCategory]); // Move replaced category to dropdown
      setTopCategories([...topCategories.slice(0, 6), { name: categoryName }]); // Replace with selected category
    }

    setDropdownVisible(false); // Close dropdown after selection
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleCardClick = (course) => {
    if (!course?.courseName) return; // Prevent errors if courseName is undefined

    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-'); // Convert to slug
    navigate(`/courseDetails/${courseSlug}`); // Navigate with new path
  };

  return (
    <div className="training-events">
      <div className="training-events-head-upcoming">
        <h1 className="association-head">Trending Courses</h1>
      </div>
      <div className="view-btn">
        <button className="view-all" onClick={() => navigate('/courseDetails')}>
          View All
        </button>
      </div>

      {/* Desktop View: Display categories in top menu and dropdown */}
      <div className="courses-list">
        {topCategories.map((category) => (
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
              {dropdownCategories.map((category) => (
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

      {/* Mobile View: Display course title and menu icon below "Trending Courses" and "View All" */}
      <div className="course-title-container">
        <h1 className="course-title">
          {activeCategory} {/* Dynamically shows the selected course */}
        </h1>
        <div className="mobile-dropdown-container">
          <RiMenuUnfold3Line className="course-menu-icon" onClick={handleDropdownClick} />
          {dropdownVisible && (
            <div className="mobile-dropdown-list">
              {categories
                .filter((category) => category.name !== activeCategory)
                .map((category) => (
                  <div
                    key={category.name}
                    className="mobile-dropdown-item"
                    onClick={() => handleCategorySelection(category.name)}
                  >
                    {category.name}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Displaying Course Cards */}
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