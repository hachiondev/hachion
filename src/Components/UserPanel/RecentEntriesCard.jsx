import React from 'react';
import './Corporate.css';
import { HiEye } from "react-icons/hi";

const RecentEntriesCard = ({ imageSrc, content, views, date, onClick }) => {
  return (
    <div className='recent-card' onClick={onClick}> 
      <img src={imageSrc} alt='card-image' className='Recent-card-image' />
      <div className='content-block'>
        <p className='content'>{content}</p>
        <div className='bottom-content'>
          <p className='views'><HiEye className='views-icon'/>  {views}</p>
          <p className='date'>
            {(() => {
              const d = new Date(date);
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              const yyyy = d.getFullYear();
              return `${mm}-${dd}-${yyyy}`;
            })()}
          </p>
          </div>
      </div>
    </div>
  );
};

export default RecentEntriesCard;