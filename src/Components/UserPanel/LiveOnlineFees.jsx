import React, { useState, useEffect } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import axios from 'axios';

export const LiveOnlineFees = () => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [fee, setFee] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/schedulecourse');
        setCourses(response.data);
        console.log(courses) // Assuming response.data is an array of courses
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourse();
  }, []);

  const handleBatchSelect = (batchId, batchFee) => {
    setSelectedBatch(batchId);
    setFee(batchFee); // Set fee dynamically from API data
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
          {/* Dynamically render batches */}
          {courses.map((course, index) => (
            <div className='partition' key={course.id || index}>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="batch" 
                  value={course.id} 
                  checked={selectedBatch === course.id}
                  onChange={() => handleBatchSelect(course.id, course.fee)} 
                  className="hidden-radio"
                />
                <span className="custom-radio"></span>
                <div className='partition-schedule'>
                  <p className='batch-date'>
                    {course.schedule_date} <span className='date-span'>({course.schedule_week})</span>
                  </p>
                  <p className='batch-date'>
                    {course.schedule_time} <span className='date-span'>({course.schedule_duration})</span>
                  </p>
                  <p className={course.schedule_mode === "Live Class" ? 'class' : 'demo'}>
                    <FaCircle className={course.schedule_mode === "Live Class" ? 'class-icon' : 'demo-icon'} />
                    {course.schedule_mode}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className='separator'></div>
        {/* Right section */}
        <LiveOnlineFeesRight fee={fee} enrollText="Enroll Now" />
      </div>
    </>
  );
};

export default LiveOnlineFees;