import React from 'react';
import img1 from '../../Assets/image.png';
import img2 from '../../Assets/image27.png';
import './Corporate.css';

const trainingOptions = [
  {
    img: img1,
    alt: 'Instructor-Led Live, Online Training',
    text: 'Instructor-Led Live, Online Training'
  },
  {
    img: img2,
    alt: 'Blended Training',
    text: 'Blended Training'
  }
];

const CorporateTrainingFeature = () => {
  return (
    <>
      <div className="instructor-banner container">
        <h2 className="become-expert-title">Empowering Teams with Innovative Online Corporate Training Solutions</h2>
        <p className="home-title-text">
         Hachion offers world-class corporate training and upskilling programs with an impressive 80% completion rate. Our platform combines interactive learning, hands-on practice, and advanced technology to build a future-ready workforce 
        </p>
      <div className='customize-training'>
        {trainingOptions.map((option, index) => (
          <div className='customize-training-div' key={index}>
            <img src={option.img} alt={option.alt} loading="lazy"/>
            <p className='customize-training-div-content'>{option.text}</p>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default CorporateTrainingFeature;
