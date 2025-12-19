import React from 'react';
import './Dashboard.css';

const DashboardCard = ({ img, heading, content, subcontent, subcolor  }) => {
  return (
    <div className='dashboard-user-div'>
      <div className='dashboard-card-row'>
        <div className='dashboard-user-heading'>{heading}</div>
        {img && <img src={img} alt={heading} />}
      </div>
      <div className='dashboard-user-text'>
        <div className='dashboard-user-content'>{content}</div>
        <div className='dashboard-user-subcontent' style={{ color: subcolor }}>{subcontent}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
