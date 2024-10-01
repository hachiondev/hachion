import React from 'react'
import { RxCalendar } from "react-icons/rx";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineStar } from "react-icons/md";
import cardbackground from '../../Assets/course2.png';

const CourseCard = ({heading,month,time,image,onClick}) => {
  return (
<>
<div className="card"  onClick={onClick} style={{ cursor: 'pointer' }} >
 <div className='card-header-div'>
 <img src={cardbackground} alt="Card" className="card-image" />

 <img src={image} alt='card-img' className='card-icon'/>  
    </div>
 
 <div className='course-details'>
 <h5 className='course-name'>{heading}</h5>
<div className='course-time'>
    <h6 className='course-month' ><RxCalendar/>   {month}</h6>
    <h6 className='course-month'><BiTimeFive/>   {time} </h6>

</div>
<h6 className='course-review'>Rating: < MdOutlineStar className='star-icon'/> 
< MdOutlineStar className='star-icon'/>< MdOutlineStar className='star-icon'/>
< MdOutlineStar className='star-icon'/>< MdOutlineStar className='star-icon'/> 100(5.0) </h6>
<button className='enroll-btn'>View Details</button>
<div className='new-batch'>
  <p className='new-batch-para'>New Batch : <span> In 5 days (4th Aug)</span></p>
</div>
 </div>
</div>
</>
  )
}

export default CourseCard
