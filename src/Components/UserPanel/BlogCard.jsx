import React from 'react';
import './Corporate.css';

const BlogCard = ({ imageSrc, content }) => {
  return (
    <div className='blog-card'>
      <img src={imageSrc} alt='blog-image' className='blog-card-image' />
      <p className='blog-content'>{content}</p>
    </div>
  );
}

export default BlogCard;
