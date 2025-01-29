import React from 'react';
import './Course.css';
import { useNavigate } from 'react-router-dom';
import corporateImage from '../../Assets/corporate.jpg';

const Corporate = () => {
  const navigate = useNavigate();

  const handleKnowMoreClick = () => {
    console.log('Know More button clicked');
    navigate('/corporate', { replace: true });
    window.scrollTo(0, 0);
  };

  // Log when the component renders
  console.log('Corporate component rendered');

  return (
    <>
      <div className="corporate">
        <div className="corporate-content">
          <img src={corporateImage} alt='corporate-image' className="corporate-image" />
          <button className="know-more" onClick={handleKnowMoreClick}>
            Know More
          </button>
        </div>
      </div>
    </>
  );
};

export default Corporate;
