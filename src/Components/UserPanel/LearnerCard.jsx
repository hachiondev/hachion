import React from 'react';
import './Corporate.css';
import { ImQuotesLeft } from "react-icons/im";
import { ImQuotesRight } from "react-icons/im";
import profile1 from '../../Assets/profile1.jfif';
import linkedin from '../../Assets/linkedin.png';
import { MdOutlineStar } from "react-icons/md";
import Avatar from '@mui/material/Avatar';

const LearnerCard = (props) => {
  return (
    <>
 <div className='learner-card'>
  <div className='learner-top'>
<div className='learner-image'>
<Avatar alt="Remy Sharp" src={profile1} className='profile-image' />
  </div>
  <div className='learner-info'>
    <div className='learner-name'>
<p className='name'>{props.name}</p>
<img src={linkedin} alt='social-media'/>
<p className='rating'>< MdOutlineStar className='star-icon'/>< MdOutlineStar className='star-icon'/>< MdOutlineStar className='star-icon'/>
< MdOutlineStar className='star-icon'/>< MdOutlineStar className='star-icon'/> </p></div>
<p className='job-profile'>{props.profile}</p>
<p className='job-location'>{props.location}</p>
    </div>
    </div>
  <div className='learner-description-bottom'>
  <ImQuotesLeft style={{width:'29.72px',height:'22.8px',color:'rgba(97, 97, 97, 1)'}}/>
    <p className='learner-description'> {props.content}</p>
      <ImQuotesRight  style={{width:'29.72px',marginLeft:'520px',marginTop:'-50px',height:'22.8px',color:'rgba(97, 97, 97, 1)'}}  />
     </div>
     </div>   
    </> 
  )
}

export default LearnerCard