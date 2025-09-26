import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold3Line } from 'react-icons/ri';
import axios from 'axios';
import PopupDemandCard from './PopupDemandCard';
import CardsPagination from './CardsPagination';
import './Home.css';

const DemandingCourses = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [totalCards, setTotalCards] = useState(0);
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
        const trendingResponse = await axios.get('https://api.test.hachion.co/trendingcourse');
        const trendingData = trendingResponse.data || [];

        const activeTrendingCourses = trendingData.filter(course => course.status);

        const allCoursesResponse = await axios.get('https://api.test.hachion.co/courses/all');
        const allCourses = allCoursesResponse.data || [];

        const trainersResponse = await axios.get('https://api.test.hachion.co/trainers');
        const allTrainers = trainersResponse.data || [];

        const detailedTrendingCourses = activeTrendingCourses.map(trendingCourse => {
          const courseDetails = allCourses.find(course => course.courseName === trendingCourse.course_name);
         const matchedTrainer = allTrainers.find(
          (t) => t.course_name.trim().toLowerCase() === trendingCourse.course_name.trim().toLowerCase()
        );

        return {
          ...trendingCourse,
          ...courseDetails,
          trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
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

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${courseSlug}`);
  };
 const updateTotalCards = (total) => {
    setTotalCards(total);
  };

  useEffect(() => {
    window.scrollTo(0, 0);  
    
    // Set cards per page based on window size
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
        setCardsPerPage(4);
    };
    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => {
      window.removeEventListener('resize', updateCardsPerPage);
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  return (
    <div className="container">
        <p className="popup-title-text">Below are the Courses most demanding in your location</p>

      {/* Courses */}
      <div className="popup-card-holder">
  {loading ? (
    Array.from({ length: cardsPerPage }).map((_, index) => (
      <div className="skeleton-card" key={index}></div>
    ))
  ) : filteredCourses.length > 0 ? (
    filteredCourses
      .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
      .map((course, index) => (
        <PopupDemandCard
          key={index}
          heading={course.courseName}
          month={course.numberOfClasses}
          image={`https://api.test.hachion.co/${course.courseImage}`}
          course_id={course.id}
          discountPercentage={course.discount}
          trainer_name={course.trainerName}
          amount={course.itotal}
          totalAmount={course.iamount}
          level={course.levels}
          onClick={() => handleCardClick(course)}
          className="course-card"
        />
      ))
  ) : (
    <p>No courses available.</p>
  )}
</div>
    </div>
  );
};

export default DemandingCourses;
