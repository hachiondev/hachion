import React from 'react';
import './Blogs.css';
import { TbBriefcaseFilled } from "react-icons/tb";
import { MdLocationOn } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { PiMapPinSimpleAreaFill } from "react-icons/pi";
import { FaCalendar } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import { FaCalendarWeek } from "react-icons/fa";
const JobDetailsCard = ({ jobTitle, companyName, image, exp, location, time, type, post, vacancy, work, salary, notice, description, qualification }) => {

  return (
    <div className='Details-column'>
    <div className='Details-card'>
        <div className='Details-title'>
  <img src={image} alt='course-img'/>
  <div className='Title-and-Details'>
    <div>
      <p className='Details-card-content'>{jobTitle}</p>
      <p className='Details-card-sub'>{companyName}</p>
      <p className='Details-icon-text'><span className='Details-icon'><FaCalendar /></span> Posted : {post}</p>
    </div>

    <div className='Details-right'>
      <div className='Job-row'>
        <div className='Job-column'>
          <p className='Details-icon-text'><span className='Details-icon'><TbBriefcaseFilled /></span> Exp : {exp}</p>
          <p className='Details-icon-text'><span className='Details-icon'><FaDollarSign /></span> Salary : {salary}</p>
          <p className='Details-icon-text'><span className='Details-icon'><MdLocationOn /></span> {location}</p>
          <p className='Details-icon-text'><span className='Details-icon'><FaCalendarWeek  /></span> Work : {work}</p>
        </div>
        <div className='Job-column'>
          <p className='Details-icon-text'><span className='Details-icon'><MdAccessTimeFilled /></span> {time}</p>
          <p className='Details-icon-text'><span className='Details-icon'><MdAccessTimeFilled /></span> Notice Period : {notice} Days</p>
          <p className='Details-icon-text'><span className='Details-icon'><PiMapPinSimpleAreaFill /></span> {type}</p>
          <p className='Details-icon-text'><span className='Details-icon'><BsFillPeopleFill /></span> Vacancies : {vacancy}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
    
    <div className='Details-card'>
      <p className='Job-card-content'>Job Description :</p>
      <p className='Details-card-text'>{description}</p>
      <p className='Job-card-content'>Requirement / Qualification :</p>
      <p className='Details-card-text'>{qualification}</p>
    </div>

    </div>
  );
};

export default JobDetailsCard;
