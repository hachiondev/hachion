import React from 'react';
import './Course.css';

const LiveOnlineTraining = ({ description, targetAudience, features }) => {
  return (
    <>
      <div>
        <p className='live-mode'>{description}</p>
        <div className='live-sections-wrapper'>
        <div className='live-section'>
          <p className='live-head'>Ideal For:</p>
          <ul className='live-list'>
            {targetAudience.flat().map((item, i) => (
              <li key={i} className='feature-item'>{item.point}</li>
            ))}
          </ul>
        </div>

        <div className='live-section'>
          <p className='live-head'>Key Features:</p>
          <ul className='live-list'>
            {features.flat().map((item, i) => (
              <li key={i} className='feature-item'>{item.content}</li>
            ))}
          </ul>
        </div>
      </div>
      </div>
    </>
  );
}

export default LiveOnlineTraining;