import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeensCard from './TeensCard';
import CardsPagination from './CardsPagination';
import './Home.css';

const TeensEvents = () => {
  const navigate = useNavigate();
  const [summerCourses, setSummerCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  useEffect(() => {
    const fetchSummerCourses = async () => {
      setLoading(true);
      try {
        const summerResponse = await axios.get('https://api.test.hachion.co/summerevents');
        const summerData = summerResponse.data || [];

        const activeSummerCourses = summerData.filter(course => course.status);

        const allCoursesResponse = await axios.get('https://api.test.hachion.co/courses/all');
        const allCourses = allCoursesResponse.data || [];

        const trainersResponse = await axios.get('https://api.test.hachion.co/trainers');
        const allTrainers = trainersResponse.data || [];

        const detailedSummerCourses = activeSummerCourses.map(summerCourse => {
        const courseDetails = allCourses.find(course => course.courseName === summerCourse.course_name);
        const matchedTrainer = allTrainers.find(
          (t) => t.course_name.trim().toLowerCase() === summerCourse.course_name.trim().toLowerCase()
        );

        return {
            ...summerCourse,
            ...courseDetails,
            trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
          };
        });

        const uniqueCategories = [
          'All',
          ...new Set(detailedSummerCourses.map(course => course.category_name)),
        ];

        setCategories(uniqueCategories);
        setSummerCourses(detailedSummerCourses);
      } catch (error) {
        console.error('Error fetching summer courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummerCourses();
  }, []);

  const filteredCourses =
    activeCategory === 'All'
      ? summerCourses
      : summerCourses.filter(course => course.category_name === activeCategory);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${courseSlug}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(4); 
      else if (width <= 1024) setCardsPerPage(4);
      else setCardsPerPage(4);
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => {
      window.removeEventListener('resize', updateCardsPerPage);
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="training-events">
      <div className="training-title-head">
        <div className="home-spacing">
          <h2 className="association-head">Online IT Training Courses For Teen’s</h2>
          <p className="association-head-tag">
            Kickstart your tech journey with expert-led online IT Certification courses for teens and beginners.
          </p>
        </div>

          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={filteredCourses.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
      </div>

      {/* Courses */}
      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, index) => (
            <div className="skeleton-card" key={index}></div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses
            .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
            .map((course, index) => (
              <TeensCard
                key={index}
                heading={course.courseName}
                month={course.numberOfClasses}
                image={`https://api.test.hachion.co/${course.courseImage}`}
                course_id={course.id}
                discountPercentage={course.discount}
                trainer_name={course.trainerName}
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

export default TeensEvents;
