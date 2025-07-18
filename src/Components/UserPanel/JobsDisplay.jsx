import React, { useEffect, useState } from 'react';
import './Blogs.css';
import JobCard from './JobCard';
import HachionLogo from '../../Assets/HachionLogo.png'; 
import axios from 'axios';
import dayjs from 'dayjs';

const JobsDisplay = ({ filters }) => {
  const { jobTitle, jobType, experience, location } = filters;
  const [jobCards, setJobCards] = useState([]);

  useEffect(() => {
    axios.get('https://api.hachion.co/hire-from-us/getApprovedJobs')
      .then((res) => {
        const formattedJobs = res.data.map((job, index) => {
          const postedDate = job.date ? dayjs(job.date) : dayjs();
          const today = dayjs();
          const daysAgo = today.diff(postedDate, 'day');

          let postedLabel = '';
          if (daysAgo <= 30) {
            postedLabel = daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
          } else {
            postedLabel = '30+ days ago';
          }

          return {
            id: job.hireFromUsId || index,
            jobTitle: job.jobTitle,
            companyName: job.company || 'Unknown',
           image: job.companyLogo
      ? `https://api.hachion.co/hire-from-us/${job.companyLogo}`
      : HachionLogo,
            exp: job.experience,
            location: job.location,
            time: job.employmentType,
            type: job.jobType,
            post: postedLabel, 
            vacancy: job.vacancies
          };
        });

        setJobCards(formattedJobs);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
      });
  }, []);

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
              key={job.id}
              job={job}
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
