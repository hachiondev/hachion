import React from 'react';
import './Blogs.css';

const KidsCourseCard = ({ CourseName, image, Skills }) => {

  return (
    <div className='kids-course-card'>
        <div className='kids-course-title'>
      <img src={image} alt='course-img'/>
      <p className='kids-course-card-content'>{CourseName}</p>
    </div>
    <p className='choose-points'>{Skills}</p>
    </div>
  );
};

export default KidsCourseCard;
