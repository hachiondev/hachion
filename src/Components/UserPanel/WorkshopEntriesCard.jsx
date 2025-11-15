import React from 'react';
import './Corporate.css';
import placeholderImage from '../../Assets/workshopplaceholder.webp';

const WorkshopEntriesCard = ({ banner_image, title, date, time, timeZone, onClick }) => {
    const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };
  return (
    <div className='workshop-card' onClick={onClick}>
      {/* <div className='card-banner' > */}
       <img src={banner_image} alt='card-image' className='workshop-card-image' onError={handleImageError} />
      {/* </div> */}
      <div className='main-content-block'>
        <p className='workshop-title'>{title}</p>
        <div className='bottom-main-content'>
          <p className='work-date'>{date}</p>
          <p className='work-date'>{time} {timeZone}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkshopEntriesCard;