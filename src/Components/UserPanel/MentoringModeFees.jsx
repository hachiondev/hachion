import React from 'react';
import './Course.css';
import LiveOnlineFeesRight from './LiveOnlineFeesRight';

const MentoringModeFees = () => {
  return (
    <>
   <div className='batch-schedule'>
    <div className='left'>
        <h2 className='mentoring-mode-heading'>
            Self-Paced Videos + Trainer Support
        </h2>
        <p className='mentoring-mode-content'>
Mentor Mode Training refers to a personalized, guided learning approach where students receive one-on-one or small group instruction from a mentor. This method is highly effective for students who need tailored support, ongoing feedback, and deeper engagement with the subject matter.</p>
    </div>
    <div className='separator'></div>
   <LiveOnlineFeesRight enrollText='Enroll Now' fee='25383'/>
   </div>
    </>
  )
}

export default MentoringModeFees