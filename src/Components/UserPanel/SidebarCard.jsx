import React from 'react';
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar } from "react-icons/md";
import './Course.css';
import cardicon from '../../Assets/image 85.png';

const SidebarCard = ({ title }) => {
  return (
    <div className="sidebar-card">
      <div className='sidebar-card-header-div'>
        <h4 className='sidebar-card-heading'>Certified Students:0</h4>
        <img src={cardicon} alt='card-img' className='sidebar-card-icon'/>
      </div>
      <div className='sidebar-course-details'>
        <h5 className='sidebar-course-name'>{title}</h5>
        <div className='sidebar-course-time'>
          <h6 className='sidebar-course-month'><RxCalendar/> 3 months</h6>
          <h6 className='sidebar-course-month'><BiTimeFive/> 80 hours </h6>
        </div>
        <h6 className='sidebar-course-review'>Rating: 5.0 <MdOutlineStar className='star-icon'/>
          <MdOutlineStar className='star-icon'/><MdOutlineStar className='star-icon'/>
          <MdOutlineStar className='star-icon'/><MdOutlineStar className='star-icon'/> (100) 
        </h6>
        <button className='sidebar-enroll-btn'>View Details</button>
      </div>
    </div>
  );
};

export default SidebarCard;
