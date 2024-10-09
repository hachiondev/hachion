import React from 'react';
import './Corporate.css';
import icon from '../../Assets/Group 39820.png';
import training from '../../Assets/Rectangle 909.png';

const CorporateTrainingFeature = () => {
  return (
    <>
      <div className='association'>
        <h1 className='association-head'>Corporate Training Features</h1>
      </div>
      <div className='corporate-training-features'>
        <div className='customized-column'>
          <div className='customized-content'>
            <img src={icon} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Customized Content</p>
              <p className='customized-content-para'>Expert Assistance, Whenever You Need It</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Projects</p>
              <p className='customized-content-para'>Expert Assistance, Whenever You Need It</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Skill Tracking</p>
              <p className='customized-content-para'>Expert Assistance, Whenever You Need It</p>
            </div>
          </div>
        </div>
        <div className='customized-column'>
          <div className='customized-content'>
            <img src={icon} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Expert Instructors</p>
              <p className='customized-content-para'>Learn from the Best</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Certification</p>
              <p className='customized-content-para'>Get Certified</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>24/7 Support</p>
              <p className='customized-content-para'>We're Here to Help</p>
            </div>
          </div>
        </div>
        <img src={training} alt='training-image' className='training-img'/>
      </div>
    </>
  );
}

export default CorporateTrainingFeature;
