import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold3Line } from 'react-icons/ri';
import axios from 'axios';
import CourseCard from './CourseCard';
import './Home.css';

const Trending = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      setLoading(true);
      try {
        const trendingResponse = await axios.get('https://api.hachion.co/trendingcourse');
        const trendingData = trendingResponse.data || [];

        const activeTrendingCourses = trendingData.filter(course => course.status);

        const allCoursesResponse = await axios.get('https://api.hachion.co/courses/all');
        const allCourses = allCoursesResponse.data || [];

        const detailedTrendingCourses = activeTrendingCourses.map(trendingCourse => {
          const courseDetails = allCourses.find(course => course.courseName === trendingCourse.course_name);
          return {
            ...trendingCourse,
            ...courseDetails,
          };
        });

        const uniqueCategories = [
          'All',
          ...new Set(detailedTrendingCourses.map(course => course.category_name)),
        ];

        setCategories(uniqueCategories);
        setTrendingCourses(detailedTrendingCourses);
      } catch (error) {
        console.error('Error fetching trending courses:', error);
      } finally {
      setLoading(false);
    }
    };

    fetchTrendingCourses();
  }, []);

  const filteredCourses =
    activeCategory === 'All'
      ? trendingCourses
      : trendingCourses.filter(course => course.category_name === activeCategory);

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
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${courseSlug}`);
  };

  return (
    <div className="training-events">
      <div className="training-events-head-upcoming">
        <h1 className="association-head">Top IT Certification Courses</h1>
      </div>

      <div className="view-btn">
        <button className="view-all" onClick={() => navigate('/coursedetails')}>
          View All
        </button>
      </div>

      {/* Top Categories */}
      {topCount > 0 && (
        <div className="courses-list">
          {categories.slice(0, topCount).map((category) => (
            <h2
              key={category}
              className={`course-names ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelection(category)}
              style={{ cursor: 'pointer' }}
            >
              {category}
            </h2>
          ))}

          {categories.length > topCount && (
            <div className="dropdown-container">
              <RiMenuUnfold3Line className="course-menu" onClick={handleDropdownClick} />
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
          <h2 className="course-title">{activeCategory}</h2>
          <div className="mobile-dropdown-container">
            <RiMenuUnfold3Line className="course-menu-icon" onClick={handleDropdownClick} />
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
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton-card" key={index}></div>
        ))
      ) : filteredCourses.length > 0 ? (
        filteredCourses.slice(0, showMore ? filteredCourses.length : 4).map((course, index) => (
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
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>

      {filteredCourses.length > 4 && (
        <button className="cards-view" onClick={toggleShowMore}>
          {showMore ? 'View Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default Trending;
