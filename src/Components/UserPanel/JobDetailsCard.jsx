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
import { Work } from '@mui/icons-material';
const JobDetailsCard = ({ JobTitle, CompanyName, image, Exp, Location, Time, Type, Post, Vacancy, Work, Salary, Notice, Description, Qualification }) => {

  return (
    <div className='Details-column'>
    <div className='Details-card'>
        <div className='Details-title'>
  <img src={image} alt='course-img'/>
  <div className='Title-and-Details'>
    <div>
      <p className='Details-card-content'>{JobTitle}</p>
      <p className='Details-card-sub'>{CompanyName}</p>
      <p className='Details-icon-text'><span className='Details-icon'><FaCalendar /></span> Posted : {Post}</p>
    </div>

    <div className='Details-right'>
      <div className='Job-row'>
        <div className='Job-column'>
          <p className='Details-icon-text'><span className='Details-icon'><TbBriefcaseFilled /></span> Exp : {Exp}</p>
          <p className='Details-icon-text'><span className='Details-icon'><FaDollarSign /></span> Salary : {Salary}</p>
          <p className='Details-icon-text'><span className='Details-icon'><MdLocationOn /></span> {Location}</p>
          <p className='Details-icon-text'><span className='Details-icon'><FaCalendarWeek  /></span> Work : {Work}</p>
        </div>
        <div className='Job-column'>
          <p className='Details-icon-text'><span className='Details-icon'><MdAccessTimeFilled /></span> {Time}</p>
          <p className='Details-icon-text'><span className='Details-icon'><MdAccessTimeFilled /></span> Notice Period : {Notice} Days</p>
          <p className='Details-icon-text'><span className='Details-icon'><PiMapPinSimpleAreaFill /></span> {Type}</p>
          <p className='Details-icon-text'><span className='Details-icon'><BsFillPeopleFill /></span> Vacancies : {Vacancy}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
    
    <div className='Details-card'>
      <p className='Job-card-content'>Job Description :</p>
      <p className='Details-card-text'>{Description}</p>
      <p className='Job-card-content'>Requirement / Qualification :</p>
      <p className='Details-card-text'>{Qualification}</p>
    </div>

    </div>
  );
};

export default JobDetailsCard;
