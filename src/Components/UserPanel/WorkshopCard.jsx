import React from 'react';
import './Corporate.css';

const WorkshopCards = ({ banner_image, title, date, time, timeZone, onClick }) => {
  return (
    <div className='main-card' onClick={onClick}>
      <div 
        className='main-card-banner' >
       <img src={banner_image} alt='card-image' className='main-card-image' />
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

export default WorkshopCards;
