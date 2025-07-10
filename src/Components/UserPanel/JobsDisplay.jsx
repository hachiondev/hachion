import React, { useState } from 'react';
import './Blogs.css';
import JobCard from './JobCard';
import HachionLogo from '../../Assets/HachionLogo.png';

const JobsDisplay = ({ filters }) => {
  const { jobTitle, jobType, experience, location } = filters;
  const [jobCards] = useState([
    {
      id: 1,
      jobTitle: 'SEO Executive',
      companyName: 'Hachion',
      image: HachionLogo,
      exp: '5+ Years',
      location: 'India',
      time: 'Full-Time',
      type: 'Remote',
      post: '07-08-2025',
      vacancy: '2'
    },
    {
      id: 2,
      jobTitle: 'Beanch Sale',
      companyName: 'Hachion',
      image: HachionLogo,
      exp: '0-1 Years',
      location: 'India',
      time: 'Full-Time',
      type: 'Hybrid',
      post: '07-08-2025',
      vacancy: '1'
    },
    {
      id: 3,
      jobTitle: 'Developer',
      companyName: 'Hachion',
      image: HachionLogo,
      exp: '2-4 Years',
      location: 'India',
      time: 'Full-Time',
      type: 'Onsite',
      post: '07-08-2025',
      vacancy: '1'
    },
  ]);
  const filteredJobs = jobCards.filter((job) => {
    const matchTitle = jobTitle ? job.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) : true;
    const matchType = jobType ? job.type.toLowerCase() === jobType.toLowerCase() : true;
    const matchExperience = experience ? job.exp === experience : true;
    const matchLocation = location ? job.location.toLowerCase() === location.toLowerCase() : true;

    return matchTitle && matchType && matchExperience && matchLocation;
  });

  return (
    <div>
      <div className='job-part'>
        {filteredJobs.length ? (
        filteredJobs.map((job) => (
          <JobCard
            key={job.id} job={job}
            jobTitle={job.jobTitle}
            companyName={job.companyName}
            image={job.image}
            exp={job.exp}
            location={job.location}
            time={job.time}
            type={job.type}
            post={job.post}
            vacancy={job.vacancy}
          />
        ))
      ) : (
        <p>No jobs match the selected filters.</p>
      )}
    </div>
    </div>
  );
};

export default JobsDisplay;