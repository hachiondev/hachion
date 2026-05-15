import React from 'react';
import './Corporate.css';
import { useNavigate } from 'react-router-dom';

const LeadingExpertCard = ({ CourseName, image, courseCategory }) => {
  const navigate = useNavigate();

const handleViewDetails = () => {

  if (!CourseName || !courseCategory) {
    console.error("Missing category/course", {
      CourseName,
      courseCategory
    });
    return;
  }

  const formattedCourseName = CourseName
    .toLowerCase()
    .replace(/\s+/g, '-');

  const formattedCategory = courseCategory
    .toLowerCase()
    .replace(/\s+/g, '-');

  navigate(`/courses/${formattedCategory}/${formattedCourseName}`);
};

  return (
    <div className='leading-expert-card'>
      <img src={image} alt='card-img'/>
      <p className='leading-expert-card-content'>{CourseName}</p>
      <button className='view-details-corporate' onClick={handleViewDetails}>
        View Details
      </button>
    </div>
  );
};

export default LeadingExpertCard;
