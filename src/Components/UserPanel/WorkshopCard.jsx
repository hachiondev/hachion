import React from 'react';
import './Corporate.css';
import placeholderImage from '../../Assets/workshopplaceholder.webp';

const WorkshopCard = ({ banner_image, title, date, time, timeZone, onClick }) => {
  const handleImageError = (e) => {
      e.target.src = placeholderImage;
    };
  return (
    <div className='main-work-card' onClick={onClick}>
      <div 
        className='main-card-banner' >
       <img src={banner_image} alt='card-image' className='main-card-image' onError={handleImageError}/>
      </div>
      <div className='main-content-block'>
        <p className='main-content'>{title}</p>
        <div className='bottom-main-content'>
          <p className='main-date'>{date}</p>
          <p className='main-date'>{time} {timeZone}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
