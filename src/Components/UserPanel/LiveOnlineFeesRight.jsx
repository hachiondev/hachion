import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LiveOnlineFeesRight = ({ enrollText, modeType }) => {
  const { courseName } = useParams(); // Get course name from URL
  const [fee, setFee] = useState('');

  useEffect(() => {
    const fetchCourseAmount = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/courses/all');
        const courses = response.data;

        // Find the matching course by courseName
        const matchedCourse = courses.find(
          (course) => course.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );

        if (matchedCourse) {
          // Determine which fee to display based on modeType
          let selectedFee;
          switch (modeType) {
            case 'live':
              selectedFee = matchedCourse.amount;
              break;
            case 'mentoring':
              selectedFee = matchedCourse.mamount;
              break;
            case 'self':
              selectedFee = matchedCourse.samount;
              break;
            case 'corporate':
              selectedFee = matchedCourse.camount;
              break;
            default:
              selectedFee = 'Not Available';
          }

          setFee(selectedFee || 'Not Available'); // Handle null values
        } else {
          setFee('Not Available');
        }
      } catch (error) {
        console.error("Error fetching course amount:", error.message);
        setFee('Error Loading Fee');
      }
    };

    fetchCourseAmount();
  }, [courseName, modeType]); // Re-fetch if mode changes

  return (
    <div className='right'>
      <p className='batch-date'>Fee:</p>
      <p className='free'>USD {fee}</p>
      <button className='fee-enroll-now'>{enrollText}</button>
    </div>
  );
};

export default LiveOnlineFeesRight;
