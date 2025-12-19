import React from 'react';
import CareerImage from '../../Assets/interview.webp';
import mentorImage from '../../Assets/mentor.webp';
import './Course.css';

// Reusable component for each feature
const ProfileBuildingItem = ({ image, title, description }) => (
  <div className='profile-building-div'>
    <img src={image} alt={title} loading="lazy"/>
    <div>
      <h5>{title}</h5>
      <p>{description}</p>
    </div>
  </div>
);

const InterviewPreparation = () => {
  // Data for each section
  const profileBuildingItems = [
    {
      image: CareerImage,
      title: 'Mock Interview Preparation',
      description: 'Students will go through a number of mock interviews conducted by technical experts who will then offer tips and constructive feedback for reference and improvement.'
    },
    {
      image: mentorImage,
      title: '1 on 1 Career Mentoring Sessions',
      description: 'Attend one-on-one sessions with career mentors on how to develop the required skills and attitude to secure a dream job based on a learner’s educational background, past experience, and future career aspirations.'
    }
  ];

  return (
    <div className='profile-building'>
      {profileBuildingItems.map((item, index) => (
        <ProfileBuildingItem
          key={index}
          image={item.image}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
}

export default InterviewPreparation;
