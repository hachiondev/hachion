import React from 'react';
import './Home.css';
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { PiCertificateFill } from "react-icons/pi";
import { GiTeamIdea } from "react-icons/gi";
import { Link } from 'react-router-dom';

// Reusable FeatureCard component
const FeatureCard = ({ icon, title, description }) => (
  <div className="card">
    <div className="icons">
      <Link to="#">{icon}</Link>
    </div>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{description}</p>
    </div>
  </div>
);

const Learning = () => {
  // Card data in an array
  const featureCards = [
    {
      icon: <FaChalkboardTeacher />,
      title: 'Live Online Training',
      description: 'Get Live interactive training from the convenience of your office or home...'
    },
    {
      icon: <IoIosTime />,
      title: 'Flexible Timings',
      description: 'Our training provides time flexibility according to own schedules...'
    },
    {
      icon: <PiCertificateFill />,
      title: 'Certification Guidance',
      description: 'Technical team will help you to get certificate in desired technologies...'
    },
    {
      icon: <GiTeamIdea />,
      title: 'Mentor Support',
      description: 'We strongly support 1:1 mentoring for professionals to meet their training needs...'
    }
  ];

  return (
    <div className="learning">
      <h2>Invest in your career with Hachion</h2>
      <p className="features">
        Get specialization in courses of IT industry, and Professional Certificates taught by
      </p>
      <p className="features">
        top instructors from leading universities and companies.
      </p>
      <div className="feature-card">
        {featureCards.map((card, index) => (
          <FeatureCard 
            key={index} 
            icon={card.icon} 
            title={card.title} 
            description={card.description} 
          />
        ))}
      </div>
    </div>
  );
}

export default Learning;
