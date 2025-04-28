import React from 'react';
import './Corporate.css';

const BlogCard = ({ imageSrc, content, onClick }) => {
  return (
    <div className="blog-card" onClick={onClick}>
      <img src={imageSrc} alt={content} />
      <h3>{content}</h3>
    </div>
  );
};

export default BlogCard;
