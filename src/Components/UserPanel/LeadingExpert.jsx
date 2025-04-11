import React, { useEffect, useState } from 'react';
import './Corporate.css';
import LeadingExpertCard from './LeadingExpertCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeadingExpert = () => {
  const navigate = useNavigate();
  const [courseCards, setCourseCards] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [corporateRes, allCoursesRes] = await Promise.all([
          axios.get("https://api.hachion.co/corporatecourse"),
          axios.get("https://api.hachion.co/courses/all"),
        ]);

        const activeCorporateCourses = corporateRes.data.filter(
          (item) => item.status === true
        );

        const combinedCourses = activeCorporateCourses.map((corpCourse) => {
          const matchedCourse = allCoursesRes.data.find(
            (course) =>
              course.courseName.trim().toLowerCase() ===
              corpCourse.course_name.trim().toLowerCase()
          );

          return {
            courseName: corpCourse.course_name,
            image: matchedCourse
              ? `https://api.hachion.co/${matchedCourse.courseImage}`
              : "", // fallback image or empty
          };
        });

        setCourseCards(combinedCourses);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <div className='training-events-head'>
        <h1 className='association-head'>Skill-Building Curriculum</h1>
        <div className='view-all-div'>
          <button className='view-all-corporate' onClick={() => navigate('/courseDetails')}>
            View All
          </button>
        </div>
      </div>

      <div className='leading-expert'>
      {courseCards.map((course, index) => (
  <LeadingExpertCard
    key={course.courseName + index} // or course.id if available
    CourseName={course.courseName}
    image={course.image}
  />
))}

      </div>
    </>
  );
};

export default LeadingExpert;