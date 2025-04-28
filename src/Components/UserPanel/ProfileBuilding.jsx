import React from 'react';
import CareerImage from '../../Assets/la_chalkboard-teacher.png';
import Resume from '../../Assets/streamline_business-user-curriculum.png';
import './Course.css';

const profileContent = [
  {
    image: CareerImage,
    alt: 'career-image',
    title: 'Career Oriented Sessions',
    description: `Over 10+ live interactive sessions with an industry expert to gain 
    knowledge and experience on how to build skills that are expected by hiring managers. 
    These will be guided sessions that will help you stay on track with your upskilling.`,
  },
  {
    image: Resume,
    alt: 'resume-image',
    title: 'Resume & LinkedIn Profile Building',
    description: `Get assistance in creating a world-class resume & LinkedIn profile from 
    our career services team and learn how to grab the attention of the hiring manager at 
    the profile shortlisting stage.`,
  },
];

const ProfileBuilding = () => {
  return (
    <div className='profile-building'>
      {profileContent.map((item, index) => (
        <div className='profile-building-div' key={index}>
          <img src={item.image} alt={item.alt} />
          <div>
            <h5>{item.title}</h5>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileBuilding;
