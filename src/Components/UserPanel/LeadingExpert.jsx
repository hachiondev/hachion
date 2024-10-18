import React from 'react';
import './Corporate.css';
import LeadingExpertCard from './LeadingExpertCard';
import card1 from '../../Assets/image 96.png';
import card2 from '../../Assets/image 85.png';
import card3 from '../../Assets/image 93.png';
import card4 from '../../Assets/image 90.png';
import card5 from '../../Assets/image 80.png';
import card6 from '../../Assets/image 107.png';
import card7 from '../../Assets/image 110.png';
import card8 from '../../Assets/image 95.png';
import { useNavigate } from 'react-router-dom';

const LeadingExpert = () => {
   const navigate=useNavigate();
  return (
 <>
 <div className='association'>
    <h1 className='association-head'>Skill-Building Curriculum</h1>
    </div>
    <div className='view-all-div'>
 <button className='view-all-corporate' onClick={()=>navigate('/course')} >View All</button>
 </div>
 <div className='leading-expert'>
    <LeadingExpertCard CourseName='AWS Developer' image={card2}/>
    <LeadingExpertCard CourseName='Google Cloud' image={card1}/> 
    <LeadingExpertCard CourseName='Python' image={card4}/>
    <LeadingExpertCard CourseName='Load Runner' image={card3}/>
    <LeadingExpertCard CourseName='ServiceNow' image={card6}/>
    <LeadingExpertCard CourseName='QA Automation' image={card5}/> 
    <LeadingExpertCard CourseName='QA Manual Testing' image={card8}/>
    <LeadingExpertCard CourseName='Python' image={card4}/>
 </div>

 </>
  )
}

export default LeadingExpert
