import React from 'react';
import './Blogs.css';
import { useNavigate } from 'react-router-dom';
import { TbBriefcaseFilled } from "react-icons/tb";
import { MdLocationOn } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { PiMapPinSimpleAreaFill } from "react-icons/pi";
import { FaCalendar } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
const JobCard = ({ JobTitle, CompanyName, image, Exp, Location, Time, Type, Post, Vacancy }) => {
 const navigate = useNavigate();
  const handleClick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  navigate('/career/apply');
};

  return (
    <div className='Job-card' onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className='Job-title'>
      <img src={image} alt='course-img'/>
      <div>
      <p className='Job-card-content'>{JobTitle}</p>
      <p className='Job-card-sub'>{CompanyName}</p>
    </div>
    </div>
    <div className='Job-row'>
    <div className='Job-column'>
    <p className='Job-icon-text'><span className='Job-icon'><TbBriefcaseFilled /></span> Exp : {Exp}</p>
    <p className='Job-icon-text'><span className='Job-icon'><MdLocationOn /></span> {Location}</p>
    <p className='Job-icon-text'><span className='Job-icon'><FaCalendar /></span> Posted : {Post}</p>
    </div>
    <div className='Job-column'>
    <p className='Job-icon-text'><span className='Job-icon'><MdAccessTimeFilled /></span> {Time}</p>
    <p className='Job-icon-text'><span className='Job-icon'><PiMapPinSimpleAreaFill /></span> {Type}</p>
    <p className='Job-icon-text'><span className='Job-icon'><BsFillPeopleFill /></span> Vacancies : {Vacancy}</p>
    </div>
    </div>
    </div>
  );
};

export default JobCard;
