import React from 'react';
import SidebarCard from './SidebarCard';
import './Course.css';

const cardData = {
  'All': ['AWS Developer', 'QA Automation', 'PMP', 'Java Full Stack', 'Salesforce Developer', 'ServiceNow', 'Python', 'RPA UI Path', 'Big Data Hadoop', 'Blue Prism', 'Subitem 1', 'Subitem 2'],
  'Project Management': ['PMP', 'Business Analyst'],
  // Other categories...
};

const SidebarRight = ({ category }) => {
  const cardsToDisplay = cardData[category] || [];

  return (
    <div className={`sidebar-right-all ${category === 'All' ? 'display-all' : ''}`}>
      {cardsToDisplay.map((cardTitle, index) => (
        <SidebarCard key={index} title={cardTitle} />
      ))}
    </div>
  );
};

export default SidebarRight;
