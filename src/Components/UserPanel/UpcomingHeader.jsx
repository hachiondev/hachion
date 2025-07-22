import React, { useEffect, useState } from 'react';
import './Course.css';
import { HashLink } from 'react-router-hash-link';

const sections = [
  { id: 'upcoming-batch', label: 'Upcoming Batches' },
  { id: 'mode-of-training', label: 'Mode of Training' },
  { id: 'corporate', label: 'About Course' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'career-support', label: 'Career Support' },
  { id: 'course-certificate', label: 'Certification' },
  { id: 'learners', label: 'Reviews' },
  { id: 'qa-faq', label: "FAQ's" },
  { id: 'trainer-profile', label: "Trainer Profile" },
];

const UpcomingHeader = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 100) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='upcoming-header'>
      <div className='upcoming-header-content'>
        {sections.map((sec) => (
          <HashLink
            key={sec.id}
            to={`#${sec.id}`}
            className={`upcoming-link ${activeSection === sec.id ? 'active' : ''}`}
          >
            {sec.label}
          </HashLink>
        ))}
      </div>
    </div>
  );
};

export default UpcomingHeader;