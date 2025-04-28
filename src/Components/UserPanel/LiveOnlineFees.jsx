import React, { useState, useEffect } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export const LiveOnlineFees = () => {
  const { courseName } = useParams();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [fee, setFee] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrollText, setEnrollText] = useState('Enroll Now');
  const [modeType, setModeType] = useState('live');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await axios.get(`/HachionUserDashboad/schedulecourse?timezone=${userTimezone}`);
        setCourses(response.data);

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
        calculatedFee = batchData.total;
        setModeType('live');
        setEnrollText('Enroll Now');
    }

    setFee(calculatedFee);
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
          <div className="batch-scroll-container">
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
                        {dayjs(course.schedule_date).format('MMM DD YYYY')} 
                        <span className='date-span'>({dayjs(course.schedule_date).format('ddd')})</span>
                      </p>
                      <p className='batch-date'>{course.schedule_time}</p>
                      <p className='batch-date'>{course.schedule_duration}</p>
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
        </div>

        <div className='separator'></div>

        <LiveOnlineFeesRight 
          enrollText={enrollText} 
          modeType={modeType} 
          selectedBatchData={filteredCourses.find(batch => batch.course_schedule_id === selectedBatch)}
          courseName={courseName}
        />
      </div>
    </>
  );
};

export default LiveOnlineFees;