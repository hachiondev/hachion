import React from 'react';
import './Corporate.css';
import { HiEye } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";

const BlogCourseCards = ({ imageSrc, content,username, views, messages, date, onClick }) => {

  const handleClick = () => {
    console.log(`Blog course card clicked:`);
    console.log(`Content: ${content}`);
    console.log(`Username: ${username}`);
    console.log(`Views: ${views}`);
    console.log(`Messages: ${messages}`);
    console.log(`Date: ${date}`);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div className='main-card' onClick={handleClick}> 
      <img src={imageSrc} alt='card-image' className='main-card-image' />
      <div className='main-content-block'>
        <p className='main-content'>{content}</p>
        <p className='user'><FaUserTie className='user-icon'/>  {username}</p>
        <div className='bottom-main-content'>
        <div className='bottom-sub-content'>
          <p className='main-views'><HiEye className='main-views-icon'/>  {views}</p>
          <p className='messages'><MdMessage className='messages-icon'/>  {messages}</p>
          </div>
          <p className='main-date'>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCourseCards;