import React from 'react';
import './Course.css';
import { HashLink } from 'react-router-hash-link';

const UpcomingHeader = () => {
  return (
    <div className='upcoming-header'>
      <div className='upcoming-header-content'>
        <HashLink to="#upcoming-batch" className='upcoming-link'>Upcoming Batches</HashLink>
        <HashLink to="#corporate" className='upcoming-link'>About Course</HashLink>
        <HashLink to="#curriculum" className='upcoming-link'>Curriculum</HashLink>
        <HashLink to="#mode-of-training" className='upcoming-link'>Mode of Training</HashLink>
        <HashLink to="#career-support" className='upcoming-link'>Career Support</HashLink>
        <HashLink to="#learners" className='upcoming-link'>Reviews</HashLink>
        <HashLink to="#qa-faq" className='upcoming-link'>FAQ's</HashLink>
      </div>
    </div>
  );
}

export default UpcomingHeader;
