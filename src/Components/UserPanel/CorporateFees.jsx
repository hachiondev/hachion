import React from 'react'
import { LiveOnlineFees } from './LiveOnlineFees'
import LiveOnlineFeesRight from './LiveOnlineFeesRight'

const CorporateFees = () => {
  return (<>
  <div className='batch-schedule'>
    <div className='left'>
    <p className='mentoring-mode-content'>Corporate Training refers to a tailored learning approach designed specifically for organizations and businesses. This mode of training is customized to meet the unique needs and goals of a company, focusing on equipping employees with the skills and knowledge necessary to excel in their roles and contribute to the organization's success.</p>
   </div>
   <div className='separator'></div>
   <LiveOnlineFeesRight fee='Talk to our advisor' enrollText='Contact us'/>
   
   </div>
   </> )
}

export default CorporateFees
