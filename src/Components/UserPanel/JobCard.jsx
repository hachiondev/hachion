import React from 'react';
import './Blogs.css';
import { useNavigate } from 'react-router-dom';
import { TbBriefcaseFilled } from "react-icons/tb";
import { MdLocationOn, MdAccessTimeFilled } from "react-icons/md";
import { PiMapPinSimpleAreaFill } from "react-icons/pi";
import { FaCalendar } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import dayjs from 'dayjs';

const JobCard = ({ jobId, jobTitle, companyName, image, exp, location, time, type, post, vacancy, salary,noticePeriod, workDays, description,
qualification }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    
  console.log('Navigating with:', {
    jobId,
    jobTitle,
    companyName,
    image,
    exp,
    location,
    time,
    type,
    post,
    vacancy,
    salary,
    noticePeriod, 
    workDays
  });

    navigate('/career/apply', {
      state: {
        jobId,
        jobTitle,
        companyName,
        image,
        exp,
        location,
        time,
        type,
        post,
        vacancy,
salary,
noticePeriod, 
workDays,
description,
qualification

      },
    });
  };

  const calculatePostedAgo = (postDateStr) => {
    const postDate = dayjs(postDateStr, 'DD-MM-YYYY');
    const today = dayjs();
    const diff = today.diff(postDate, 'day');

    if (diff <= 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff <= 30) return `${diff} days ago`;
    return '30+ days ago';
  };

  return (
    <div className='Job-card' onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className='Job-title'>
        <img src={image} alt='job-img'/>
        <div>
          <p className='Job-card-content'>{jobTitle}</p>
          <p className='Job-card-sub'>{companyName}</p>
        </div>
      </div>

      <div className='Job-row'>
        <div className='Job-column'>
          <p className='Job-icon-text'>
            <span className='Job-icon'><TbBriefcaseFilled /></span> Exp : {exp}
          </p>
          <p className='Job-icon-text'>
            <span className='Job-icon'><MdLocationOn /></span> {location}
          </p>
          <p className='Job-icon-text'>
            <span className='Job-icon'><FaCalendar /></span> Posted : {post}
          </p>
        </div>

        <div className='Job-column'>
          <p className='Job-icon-text'>
            <span className='Job-icon'><MdAccessTimeFilled /></span> {time}
          </p>
          <p className='Job-icon-text'>
            <span className='Job-icon'><PiMapPinSimpleAreaFill /></span> {type}
          </p>
          <p className='Job-icon-text'>
            <span className='Job-icon'><BsFillPeopleFill /></span> Vacancies : {vacancy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
