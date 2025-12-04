import React, { useEffect, useState } from 'react';
import './Home.css';
import {  useNavigate } from 'react-router-dom';

const TrendingCourseNames = () => {
const navigate= useNavigate();
  const [courses, setCourses] = useState([]);
      useEffect(() => {
        const fetchTrendingCourses = async () => {
          try {
            const response = await fetch('https://api.hachion.co/trendingcourse');
            const data = await response.json();
            // Filter courses with status true
            const activeCourses = data.filter(course => course.status === true);
            setCourses(activeCourses);
          } catch (error) {
            console.error('Error fetching trending courses:', error);
          }
        };
    
        fetchTrendingCourses();
      }, []);
    
      const handleNavigation = (courseName) => {
        const formattedName = courseName.toLowerCase().replace(/\s+/g, '-');
        navigate(`/coursedetails/${formattedName}`);
      };
  return (
    <>
      <div className='trending-data'>
        <h2 className='trending-title'>Trending Topics</h2>
      <div className="trending-content container">
            {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <React.Fragment key={course.trendingcourse_id}>
                      <p
                        className='trending-courses'
                        onClick={() => handleNavigation(course.course_name)}
                        style={{ cursor: 'pointer' }}
                      >
                        {course.course_name}
                      </p>
                    </React.Fragment>
                  ))
                ) : (
                  <p>No active courses available.</p>
                )}
      </div>
      </div>
    </>
  );
};

export default TrendingCourseNames;
