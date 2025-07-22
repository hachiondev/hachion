import React from 'react';
import './Blogs.css';
import JobDetailsCard from './JobDetailsCard';
import HachionLogo from '../../Assets/HachionLogo.png';
import { useLocation } from 'react-router-dom';


const ApplyDetails = () => {
  const { state } = useLocation();  
  if (!state) {
    return <p>Job details not available. Please go back and select a job.</p>;
  }

  const {
    jobTitle,
    companyName,
    image = HachionLogo,
    exp,
    location,
    time,
    type,
    post,
    workDays = 'Mon-Fri', 
    vacancy,
    salary = 'Not disclosed',
    noticePeriod = 'N/A',
    description = 'No description provided.',
    qualification = 'No qualifications specified.',
  } = state;

  return (
    <div className='Details-part'>
      <JobDetailsCard
        jobTitle={jobTitle}
        companyName={companyName}
        image={image}
        exp={exp}
        location={location}
        time={time}
        type={type}
        post={post}
        workDays={workDays}
        vacancy={vacancy}
        salary={salary}
        noticePeriod={noticePeriod}
        description={description}
        qualification={qualification}
      />
    </div>
  );
};

export default ApplyDetails;
