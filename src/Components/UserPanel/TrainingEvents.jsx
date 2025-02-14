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
          fetch('https://api.hachion.co/schedulecourse').then((res) => res.json()),
          fetch('https://api.hachion.co/courses/all').then((res) => res.json()),
        ]);

        if (!Array.isArray(scheduleResponse) || !Array.isArray(coursesResponse)) {
          throw new Error("Invalid API response format");
        }

        const mergedData = scheduleResponse.map((scheduleItem) => {
          const matchingCourse = coursesResponse.find(
            (course) => course.courseName.toLowerCase() === scheduleItem.schedule_course_name.toLowerCase()
          );

          return {
            ...scheduleItem,
            course_id: matchingCourse?.id || null,
            course_image: matchingCourse?.courseImage || '', // Ensure a default empty string
          };
        });

        console.log('Merged Courses:', mergedData);
        setMergedCourses(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="training-events">
      <div className="training-events-head">
        <h1 className="association-head">Upcoming Training Events</h1>
      </div>

      <div className="view-btn">
        <button
          className="view-all"
          onClick={() => (viewAll ? navigate('/course') : setViewAll(true))}
        >
          {viewAll ? 'View Courses Page' : 'View All'}
        </button>
      </div>

      <div className="training-card-holder">
        {(viewAll ? mergedCourses : mergedCourses.slice(0, 4)).map((course, index) => (
          <TrainingCard
            key={course.course_id || index}
            id={course.course_id}
            heading={course.schedule_course_name}
            image={course.course_image ? `https://api.hachion.co/${course.course_image}` : ''}
            date={formatDate(course.schedule_date)}
            time={course.schedule_time || 'TBA'}
            duration={course.schedule_duration ? `Duration: ${course.schedule_duration}` : 'Duration: TBA'}
            mode={course.schedule_mode || 'TBA'}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainingEvents;