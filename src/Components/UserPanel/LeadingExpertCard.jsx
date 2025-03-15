import React from 'react';
import './Corporate.css';
import { useNavigate } from 'react-router-dom';

const LeadingExpertCard = ({CourseName,image}) => {
  const navigate=useNavigate();
  return (
    <div className='leading-expert-card'>
     <img src={image} alt='card-img' className='card-image'/> 
    <p className='leading-expert-card-content'>{CourseName}</p>
    <button className='view-details-corporate' onClick={()=>navigate('/CourseDetails')}>View Details</button>
</div>
  )
}

export default LeadingExpertCard;