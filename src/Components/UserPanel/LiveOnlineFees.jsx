import React, { useState, useEffect } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export const LiveOnlineFees = () => {
  const { courseName } = useParams(); // Extract courseName from URL
  const [selectedBatch, setSelectedBatch] = useState('');
  const [fee, setFee] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrollText, setEnrollText] = useState('Enroll Now');
  const [modeType, setModeType] = useState('live');

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
        calculatedFee = batchData.total;
        setModeType('live');
        setEnrollText('Enroll Now');
        break;
      case "Live Demo":
        calculatedFee = 'Free';
        setModeType('live');
        setEnrollText('Enroll Free Demo');
        break;
      case "Mentoring Mode":
        calculatedFee = batchData.mtotal;
        setModeType('mentoring');
        setEnrollText('Enroll Now');
        break;
      case "Self-Paced":
        calculatedFee = batchData.stotal;
        setModeType('self');
        setEnrollText('Enroll Now');
        break;
      case "Corporate Training":
        calculatedFee = batchData.ctotal;
        setModeType('corporate');
        setEnrollText('Enroll Now');
        break;
      default:
        calculatedFee = batchData.total; // Default to Live Class if no match
        setModeType('live');
        setEnrollText('Enroll Now');
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
                    {dayjs(course.schedule_date).format('MMM DD YYYY')} <span className='date-span'>
                    ({dayjs(course.schedule_date).format('ddd')})
                    </span>
                    </p>
                    <p className='batch-date'>
                      {course.schedule_time} EST <span className='date-span'>({course.schedule_duration} Hour)</span>
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
            <p className='batch-text'>No batches available for this course.</p>
          )}
        </div>

        <div className='separator'></div>
        <LiveOnlineFeesRight enrollText={enrollText} modeType={modeType} />
      </div>
    </>
  );
};

export default LiveOnlineFees;