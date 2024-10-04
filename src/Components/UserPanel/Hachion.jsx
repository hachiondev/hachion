import React from 'react';
import './Corporate.css';
import slashTrainingBudget from '../../Assets/slashTraining.png';
import remoteTraining from '../../Assets/remoteTraining.png';
import flexibleTraining from '../../Assets/flexibleSchedule.png';
import flexibleDesign from '../../Assets/flexibleDesign.png';
import workforceNeeds from '../../Assets/workforceNeeds.png';
import expertHelp from '../../Assets/expertHelp.png';

const Hachion = () => {
  return (
    <>
      <div className='association'>
        <h1 className='association-head'>Why Choose Hachion?</h1>
      </div>
      <div className='hachion-content'>
        <div className='about-us-row'>
          <div className='about-us-div-content'>
            <img src={slashTrainingBudget} alt='slash-training-image' />
            <h6>Slash Training Budget</h6>
            <p>Optimising Cost without compromising quality</p>
          </div>
          <div className='about-us-div-content'>
            <img src={remoteTraining} alt='remote-training' />
            <h6>Remote Training For Employees</h6>
            <p>Access learning anytime, anywhere with flexibility.</p>
          </div>
          <div className='about-us-div-content'>
            <img src={flexibleTraining} alt='' />
            <h6>Flexible Training Schedules</h6>
            <p>Adaptable learning time that fit your needs</p>
          </div>
          <div className='about-us-div-content'>
            <img src={flexibleDesign} alt='' />
            <h6>Flexible Syllabus Design</h6>
            <p>Easily customize course content to suit your goals.</p>
          </div>
          <div className='about-us-div-content'>
            <img src={workforceNeeds} alt='' />
            <h6>Evaluate Workforce Needs</h6>
            <p>Assess skills and requirement for optimal performance.</p>
          </div>
          <div className='about-us-div-content'>
            <img src={expertHelp} alt='' />
            <h6>Expert help via chat</h6>
            <p>Immediate support from knowledgeable professionals.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hachion;
