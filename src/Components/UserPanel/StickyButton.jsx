import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Blogs.css';

const StickyButton = () => {
    const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lead-form');
  };
  return (
    <div className="vertical-sticky-bar">
       <button onClick={handleClick} className="sticky-link">
        Register Now
      </button>
    </div>
  );
};

export default StickyButton;
