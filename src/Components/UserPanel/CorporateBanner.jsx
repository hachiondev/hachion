import React from 'react';
import './Corporate.css';

const CorporateBanner = ({ onContactUsClick }) => {
  return (
    <div className='corporate-banner'>
      <p className='corporate-banner-heading'>Corporate Training</p>
      <p className='corporate-banner-content'>Innovative Learning for Effective Performance</p>
      <p className='corporate-banner-bottom-content'>Prepare Your Team for the Next Era of Innovation</p>
      <div className='corporate-button'>
      <button className='contact-us-corporate' onClick={onContactUsClick}>Contact Us</button>
    </div>
    </div>
  );
};

export default CorporateBanner;
