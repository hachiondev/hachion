import React from 'react';
import './Course.css';
import { useNavigate } from 'react-router-dom';
import corporateImage from '../../Assets/corporatenew.webp';

const Corporate = () => {
  const navigate = useNavigate();

  const handleKnowMoreClick = () => {
    navigate('/corporate', { replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="corporate">
        <div className="corporate-data">
          <img src={corporateImage} alt='corporate-image' className="corporate-image" loading="lazy"/>
           <div className="corporate-content">
            <h2 className="corporate-banner-text">Enhance Your Team’s Skills: Explore Our Corporate Training Options</h2>
          <button className="know-more" onClick={handleKnowMoreClick}>
            Know More
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default Corporate;
