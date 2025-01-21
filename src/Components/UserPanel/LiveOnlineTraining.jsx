import React from 'react';
import './Course.css';

const LiveOnlineTraining = ({ description, targetAudience, features }) => {
  return (
    <>
      <div>
        <p className='live-mode'>{description}</p>
        <p className='live-head'>Target Audience:</p>
        <p className='live-mode'>{targetAudience}</p>
        <p className='live-head'>Features :</p>
        <div className='live-mode-feature'>
          {features.map((featureGroup, index) => (
            <div className='mode-feature' key={index}>
              {featureGroup.map((feature, i) => (
                <div className='feature-icons' key={i}>
                  <img src={feature.icon} alt='mode-of training' className='features-icon'/>
                  <p className='feature-content'>{feature.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LiveOnlineTraining;
