import React from 'react';
import './Course.css';
import { HashLink } from 'react-router-hash-link';

const UpcomingHeader = () => {
  const scrollWithOffset = (el) => {
    const offset = 100; // Adjust this based on your sticky header height
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
  };

  return (
    <div className='upcoming-header'>
      <div className='upcoming-header-content'>
        <HashLink to="#upcoming-batch" className='upcoming-link' scroll={scrollWithOffset}>
          Upcoming Batches
        </HashLink>
        <HashLink to="#corporate" className='upcoming-link' scroll={scrollWithOffset}>
          About Course
        </HashLink>
        <HashLink to="#curriculum" className='upcoming-link' scroll={scrollWithOffset}>
          Curriculum
        </HashLink>
        <HashLink to="#mode-of-training" className='upcoming-link' scroll={scrollWithOffset}>
          Mode of Training
        </HashLink>
        <HashLink to="#career-support" className='upcoming-link' scroll={scrollWithOffset}>
          Career Support
        </HashLink>
        <HashLink to="#learners" className='upcoming-link' scroll={scrollWithOffset}>
          Reviews
        </HashLink>
        <HashLink to="#qa-faq" className='upcoming-link' scroll={scrollWithOffset}>
          FAQ's
        </HashLink>
      </div>
    </div>
  );
};

export default UpcomingHeader;
