import React, { useState } from 'react';
import './Blogs.css';
import JobDetailsCard from './JobDetailsCard';
import HachionLogo from '../../Assets/HachionLogo.png';
import { Work } from '@mui/icons-material';

const ApplyDetails = () => {
  const [jobDetailsCards] = useState([
    {
      JobTitle: 'SEO Executive',
      CompanyName: 'Hachion',
      image: HachionLogo,
      Exp: '2-3 Years',
      Location: 'India',
      Time: 'Full-Time',
      Type: 'Remote',
      Post: '07-08-2025',
      Work: 'Mon-Fri',
      Vacancy: '2',
      Salary: '3 LPA',
      Notice: '30',
      Description: 'Were hiring a Mobile App Developer with expertise in React to build scalable,AI-powered mobile apps.Must have strong React/JS/TS skills,UI/UX sense, and experience with APIs,Git and AI integration.Great team player with sharp problem-solving skills.',
      Qualification: '2+ years of hands-on experience in front-end development with React.js. Proficiency in JavaScript, TypeScript, HTML5, CSS3, and ES6+. Strong understanding of React.js principles and lifecycle.',
    },
  ]);

  return (
      <div className='Details-part'>
        {jobDetailsCards.map((course, index) => (
          <JobDetailsCard
            key={course.JobTitle + index}
            JobTitle={course.JobTitle}
            CompanyName={course.CompanyName}
            image={course.image}
            Exp={course.Exp}
            Location={course.Location}
            Time={course.Time}
            Type={course.Type}
            Post={course.Post}
            Work={course.Work}
            Vacancy={course.Vacancy}
            Salary={course.Salary}
            Notice={course.Notice}
            Description={course.Description}
            Qualification={course.Qualification}
          />
        ))}
      </div>
  );
};

export default ApplyDetails;