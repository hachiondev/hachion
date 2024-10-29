import React from 'react';
import './Corporate.css';
import { GrFormView } from "react-icons/gr";



const RecentEntriesCard = ({ imageSrc, content, views, date, onClick }) => {
  return (
    <div className='recent-card' onClick={onClick}> 
      <img src={imageSrc} alt='card-image' className='Recent-card-image' />
      <div className='content-block'>
        <p className='content'>{content}</p>
        <div className='bottom-content'>
          <p className='views'><GrFormView className='views-icon'/>  {views}</p>
          <p className='date'>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentEntriesCard;