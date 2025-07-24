import React from 'react';
import './Course.css';
import { useNavigate } from 'react-router-dom';
import corporateImage from '../../Assets/corporate.jpg';

const Corporate = () => {
  const navigate = useNavigate();

  const handleKnowMoreClick = () => {
    navigate('/corporate', { replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="corporate">
        <div className="corporate-content">
          <img src={corporateImage} alt='corporate-image' className="corporate-image" loading="lazy"/>
          <button className="know-more" onClick={handleKnowMoreClick}>
            Know More
          </button>
        </div>
      </div>
    </>
  );
};

export default Corporate;
