import React from 'react';
import './Corporate.css';

const LeadingExpertCard = ({CourseName,image}) => {
  return (
    <div className='leading-expert-card'>
     <img src={image} alt='card-img' className='card-image'/> 
    <p className='leading-expert-card-content'>{CourseName}</p>
    <button className='view-details-corporate'>View Details</button>
</div>
  )
}

export default LeadingExpertCard;
