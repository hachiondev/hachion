import React from 'react';
import '../../UserPanel/Course.css'
import { useNavigate } from 'react-router-dom';
import corporateImage from '../../../Assets/corporatenew.webp';

const Corporate = () => {
  const navigate = useNavigate();

  const handleKnowMoreClick = () => {
    navigate('/corporate', { replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="corporate">
        <div className="corporate-data container">
          <img src={corporateImage} alt='corporate-image' className="corporate-image" loading="lazy"/>
           <div className="corporate-content">
            <h2 className="corporate-banner-text">Transform your business with customized corporate programs</h2>
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
