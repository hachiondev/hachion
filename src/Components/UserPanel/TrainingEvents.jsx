import React, { useEffect, useState } from 'react';
import TrainingCard from './TrainingCard';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const TrainingEvents = () => {
  const navigate = useNavigate();
  const [mergedCourses, setMergedCourses] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleResponse, coursesResponse] = await Promise.all([
          fetch('http://localhost:8080/schedulecourse').then((res) => res.json()),
          fetch('http://localhost:8080/courses/all').then((res) => res.json()),
        ]);
  
        const mergedData = scheduleResponse.map((scheduleItem) => {
          const matchingCourse = coursesResponse.find(
            (course) => course.courseName.toLowerCase() === scheduleItem.schedule_course_name.toLowerCase()
          );
          return {
            ...scheduleItem,
            course_id: matchingCourse ? matchingCourse.id : null,
            course_image: matchingCourse ? matchingCourse.courseImage : '', // Optionally include course image
          };
        });
  
        console.log('Merged Courses:', mergedData); // Debugging merged data
        setMergedCourses(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="training-events">
      <div className="training-events-head">
        <h1 className="association-head">Upcoming Training Events</h1>
      </div>
    
      <div className="view-btn">
        <button
          className="view-all"
          onClick={() => {
            if (!viewAll) {
              setViewAll(true);
            } else {
              navigate('/course');
            }
          }}
        >
          {viewAll ? 'View Courses Page' : 'View All'}
        </button>
      </div>
      <div className="training-card-holder">
        {(viewAll ? mergedCourses : mergedCourses.slice(0, 4)).map((course, index) => (
             <TrainingCard
             key={index}
             id={course.course_id}
             heading={course.schedule_course_name}
             image={`http://localhost:8080/${course.course_image}`} // Use course_image
             date={formatDate(course.schedule_date)}
             time={course.schedule_time}
             duration={`Duration: ${course.schedule_duration}`}
             mode={course.schedule_mode}
           />
          
        ))}
       
      </div>
    </div>
  );
};

export default TrainingEvents;