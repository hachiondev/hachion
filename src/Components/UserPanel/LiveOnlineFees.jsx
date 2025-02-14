import React, { useState, useEffect } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const LiveOnlineFees = () => {
  const { courseName } = useParams(); // Extract courseName from URL
  const [selectedBatch, setSelectedBatch] = useState('');
  const [fee, setFee] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/schedulecourse');
        setCourses(response.data);

        // Filter courses based on the courseName from URL
        const filteredData = response.data.filter(
          (course) => course.schedule_course_name.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setFilteredCourses(filteredData);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, [courseName]);

  const handleBatchSelect = (batchId, batchData) => {
    setSelectedBatch(batchId);

    // Determine the fee based on schedule_mode
    let calculatedFee = '';
    switch (batchData.schedule_mode) {
      case "Live Class":
        calculatedFee = batchData.amount;
        break;
      case "Mentoring Mode":
        calculatedFee = batchData.mamount;
        break;
      case "Self-Paced":
        calculatedFee = batchData.samount;
        break;
      case "Corporate Training":
        calculatedFee = batchData.camount;
        break;
      default:
        calculatedFee = batchData.amount; // Default to Live Class if no match
    }

    setFee(calculatedFee);
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div className='partition' key={course.course_schedule_id || index}>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="batch" 
                    value={course.course_schedule_id} 
                    checked={selectedBatch === course.course_schedule_id}
                    onChange={() => handleBatchSelect(course.course_schedule_id, course)}
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
            ))
          ) : (
            <p>No batches available for this course.</p>
          )}
        </div>

        <div className='separator'></div>
        <LiveOnlineFeesRight enrollText='Enroll Now' modeType="live" />
      </div>
    </>
  );
};

export default LiveOnlineFees;
