import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from '../../Assets/image 80.png';
import { MdOutlineStar } from "react-icons/md";
import qaheader from '../../Assets/qa-video.png';
import { IoPlayCircleOutline } from 'react-icons/io5';
import './Course.css';

const QaTop = ({ onVideoButtonClick }) => {
  const { courseName } = useParams(); // Extract course_id from URL params
  const navigate = useNavigate();
  const [curriculumData, setCurriculumData] = useState({
    course_name: "",
    curriculum_pdf: null,
  });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDownload = () => {
    if (!curriculumData.curriculum_pdf) {
      alert("No PDF available for download. Please contact trainings@hachion.co");
      return;
    }

    const url = URL.createObjectURL(curriculumData.curriculum_pdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = curriculumData.curriculum_pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.hachion.co/courses/all');
        const courseData = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course details not available</div>;

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

  return (
    <>
      <div className='qa-automation'>
        <div className='qa-inside'>
        <div className='qa-left-part'>
          <p className='mob-cert'>Certified-students: {course.totalEnrollment}</p>
          <div className='qa-automation-left'>
            <img src={`https://api.hachion.co/${course.courseImage}`} alt='qa-image' />
            <div className='qa-automation-middle'>
              <p className='fee'>Fee: <span className='amount'>USD {course.total}/-</span></p>
              <h6 className='sidebar-course-review'>
                Rating: {course.starRating} {renderStars(course.starRating)} ({course.ratingByNumberOfPeople})
              </h6>
            </div>
          </div>
          <div className="qa-content" dangerouslySetInnerHTML={{ __html: course.courseHighlight.trim() }} />
        </div>
        
        <div className='qa-right'>
          <p className='certified'>Certified-students: {course.totalEnrollment}</p>
          <img src={qaheader} alt='video-frame' />
        </div>
        </div>

      {/* Buttons Section */}
      <div className='qa-button-container'>
        <div className='qa-button'>
          <button className='enroll-now' onClick={() => navigate('/enroll')}>Enroll Now</button>
          <button className="download" onClick={handleDownload}>Download Brochure</button>
          </div>
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