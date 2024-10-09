import React from 'react'
import LiveOnlineFeesRight from './LiveOnlineFeesRight';

const SelfPlacedFees = () => {
  return (
   <>
<div className='batch-schedule'>
    <div className='left'>
  <p className='mentoring-mode-content'>
    Self-Paced Training is a flexible learning approach where students can access course materials and complete assignments at their own pace. This mode allows learners to study according to their own schedule, without the constraints of fixed class times or deadlines.
    </p>
    </div>
   <div className='separator'></div>
   <LiveOnlineFeesRight enrollText='Enroll Now' fee='15383'/>
   </div>
   </>
  )
}

export default SelfPlacedFees
