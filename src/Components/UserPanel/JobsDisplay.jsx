import React, { useState } from 'react';
import './Blogs.css';
import JobCard from './JobCard';
import HachionLogo from '../../Assets/HachionLogo.png';

const JobsDisplay = () => {
  const [jobCards] = useState([
    {
      JobTitle: 'SEO Executive',
      CompanyName: 'Hachion',
      image: HachionLogo,
      Exp: '2-3 Years',
      Location: 'India',
      Time: 'Full-Time',
      Type: 'Remote',
      Post: '07-08-2025',
      Vacancy: '2'
    },
    {
      JobTitle: 'Beanch Sale',
      CompanyName: 'Hachion',
      image: HachionLogo,
      Exp: '2-3 Years',
      Location: 'India',
      Time: 'Full-Time',
      Type: 'Remote',
      Post: '07-08-2025',
      Vacancy: '1'
    },
    {
      JobTitle: 'Developer',
      CompanyName: 'Hachion',
      image: HachionLogo,
      Exp: '2-3 Years',
      Location: 'India',
      Time: 'Full-Time',
      Type: 'Remote',
      Post: '07-08-2025',
      Vacancy: '1'
    },
  ]);

  return (
    <div>
      <div className='job-part'>
        {jobCards.map((course, index) => (
          <JobCard
            key={course.JobTitle + index}
            JobTitle={course.JobTitle}
            CompanyName={course.CompanyName}
            image={course.image}
            Exp={course.Exp}
            Location={course.Location}
            Time={course.Time}
            Type={course.Type}
            Post={course.Post}
            Vacancy={course.Vacancy}
          />
        ))}
      </div>
    </div>
  );
};

export default JobsDisplay;