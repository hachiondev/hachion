import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from '../../Assets/image 80.png';
import { MdOutlineStar } from "react-icons/md";
import qaheader from '../../Assets/qa-video.png';
import { IoPlayCircleOutline } from 'react-icons/io5';
import './Course.css';

const QaTop = ({ onVideoButtonClick }) => {
  const { course_id } = useParams(); // Extract course_id from URL params
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details based on course_id
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://160.153.175.69:8080/courses/${course_id}`);
        
        if (response.data) {
          setCourse(response.data); // Set course details from API response
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError('Error fetching course data');
      } finally {
        setLoading(false);
      }
    };

    if (course_id) {
      fetchCourseData();
    } else {
      console.error('Course ID is missing!');
    }
  }, [course_id]);

  // Function to render stars dynamically based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <MdOutlineStar key={i} className="star-icon filled" />
        ) : (
          <MdOutlineStar key={i} className="star-icon" />
        )
      );
    }
    return stars;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className='qa-automation'>
        <div className='qa-left-part'>
          <p className='mob-cert'>Certified-students: {course.totalEnrollment}</p>
          <div className='qa-automation-left'>
            <img src={`http://160.153.175.69:8080/${course.courseImage}`} alt='qa-image' />
            <div className='qa-automation-middle'>
              <p className='fee'>Fee: <span className='amount'>₹{course.amount}/-</span></p>
              <h6 className='sidebar-course-review'>
                Rating: {course.starRating} {renderStars(course.starRating)} ({course.ratingByNumberOfPeople})
              </h6>
            </div>
          </div>
          <div className='qa-content'>
            <p>{course.courseHighlight}</p> {/* Display course highlight */}
          </div>
          <div className='qa-button'>
            <button className='enroll-now' onClick={() => navigate('/enroll')}>Enroll Now</button>
            <button className='download'>Download Brochure</button>
          </div>
        </div>
        <div className='qa-right'>
          <p className='certified'>Certified-students: {course.totalEnrollment}</p>
          <img src={qaheader} alt='video-frame' />
          <button className='video-btn' onClick={onVideoButtonClick}>
            <IoPlayCircleOutline className='video-btn-icon' />
            Watch Demo Videos
          </button>
        </div>
      </div>
    </>
  );
};

export default QaTop;
