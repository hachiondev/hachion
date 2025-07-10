import React, { useState } from 'react';
import './Blogs.css';
import JobDetailsCard from './JobDetailsCard';
import HachionLogo from '../../Assets/HachionLogo.png';

const ApplyDetails = () => {
  const [jobDetailsCards] = useState([
    {
      jobTitle: 'SEO Executive',
      companyName: 'Hachion',
      image: HachionLogo,
      exp: '2-3 Years',
      location: 'India',
      time: 'Full-Time',
      type: 'Remote',
      post: '07-08-2025',
      work: 'Mon-Fri',
      vacancy: '2',
      salary: '3 LPA',
      notice: '30',
      description: 'Were hiring a Mobile App Developer with expertise in React to build scalable,AI-powered mobile apps.Must have strong React/JS/TS skills,UI/UX sense, and experience with APIs,Git and AI integration.Great team player with sharp problem-solving skills.',
      qualification: '2+ years of hands-on experience in front-end development with React.js. Proficiency in JavaScript, TypeScript, HTML5, CSS3, and ES6+. Strong understanding of React.js principles and lifecycle.',
    },
  ]);

  return (
      <div className='Details-part'>
        {jobDetailsCards.map((course, index) => (
          <JobDetailsCard
            key={course.jobTitle + index}
            jobTitle={course.jobTitle}
            companyName={course.companyName}
            image={course.image}
            exp={course.exp}
            location={course.location}
            time={course.time}
            type={course.type}
            post={course.post}
            work={course.work}
            vacancy={course.vacancy}
            salary={course.salary}
            notice={course.notice}
            description={course.description}
            qualification={course.qualification}
          />
        ))}
      </div>
  );
};

export default ApplyDetails;