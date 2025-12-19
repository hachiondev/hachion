import React from 'react'
import LiveOnlineFeesRight from './LiveOnlineFeesRight';

const SelfPacedQAFees = () => {
  return (
   <>
<div className='batch-schedule'>
    <div className='left-mode'>
  <p className='mentoring-mode-content'>
    Self-Paced with Q&A Training offers flexible learning where students access materials anytime and learn at their own pace. Learners can ask questions and receive expert support whenever needed. This approach combines independence with guided assistance for an effective learning experience.
    </p>
    </div>
   <div className='separator'></div>
   <LiveOnlineFeesRight enrollText='Enroll Now' modeType="selfqa"/>
   </div>
   </>
  )
}

export default SelfPacedQAFees
