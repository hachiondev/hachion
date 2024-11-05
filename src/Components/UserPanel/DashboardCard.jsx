import React from 'react';
import './Dashboard.css';

const DashboardCard = ({ icon: Icon, background, heading, content }) => {
  return (
    <div className='dashboard-div' style={{ background: background }}>
      <div className='dashboard-icon'>
        <Icon />
      </div>
      <div className='dashboard-text'>
        <p className='dashboard-heading'>{heading}</p>
        <p className='dashboard-content'>{content}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
