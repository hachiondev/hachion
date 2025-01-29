import React from 'react';
import './Corporate.css';

const BlogCard = ({ imageSrc, content, onClick }) => {

  const handleClick = () => {
    console.log(`Blog card clicked: ${content}`);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="blog-card" onClick={handleClick}>
      <img src={imageSrc} alt={content} />
      <h3>{content}</h3>
    </div>
  );
};

export default BlogCard;
