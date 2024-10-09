import React from 'react';
import './Corporate.css';
import {FaUser} from 'react-icons/fa';



const RecentEntriesCard = ({ imageSrc, content,username,date }) => {
  return (
    <div className='recent-card'>
      <img src={imageSrc} alt='card-image' className='Recent-card-image' />
      <div className='content-block'>
        <p className='content'>{content}</p>
        <div className='bottom-content'>
            <p className='user'><FaUser/>  {username}</p>
            <p className='date'>{date}</p>
        </div>
      </div>
    </div>
  );
}

export default RecentEntriesCard;