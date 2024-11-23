import React from 'react';
import './Corporate.css';
import icon1 from '../../Assets/content.jpg';
import icon2 from '../../Assets/support.jpg';
import icon3 from '../../Assets/project.jpg';
import icon4 from '../../Assets/flexibility.jpg';
import icon5 from '../../Assets/skill.jpg';
import icon6 from '../../Assets/certificate.jpg';
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
            <img src={icon1} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Customized Content</p>
              <p className='customized-content-para'>Flexible Content Solutions, Designed for Your Goals</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon2} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>24/7 Support</p>
              <p className='customized-content-para'>Expert Assistance, Whenever You Need It</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon3} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Projects</p>
              <p className='customized-content-para'>Designed for Impact, Executed with Care</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon4} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Flexiblity</p>
              <p className='customized-content-para'>Adapting to Your Needs, Anytime</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon5} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Skill Tracking</p>
              <p className='customized-content-para'>Monitor Growth, Enhance Performance</p>
            </div>
          </div>
          <div className='customized-content'>
            <img src={icon6} alt='icon-image'/>
            <div>
              <p className='customized-content-heading'>Certification</p>
              <p className='customized-content-para'>Validate Your Skills, Advance Your Career</p>
            </div>
          </div>
        </div>
        <img src={training} alt='training-image' className='training-img'/>
      </div>
    </>
  );
}

export default CorporateTrainingFeature;
