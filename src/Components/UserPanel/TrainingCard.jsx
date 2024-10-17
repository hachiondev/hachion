import React from 'react'
import './Home.css';
import { FaCircle } from "react-icons/fa";
import imageUrl from '../../Assets/course_card2.png';
import { useNavigate } from 'react-router-dom';


 const TrainingCard = (props) => {
  const navigate=useNavigate();
  return (
  <>
<div className="card" >
 <div className='card-header-div'>
 
 <img src={imageUrl} alt="Card" className="card-image" />
 <div className='card-header'>
  {/* <p className='card-header-content'> */}
  <FaCircle className='card-header-icon'/>Live Demo</div>
  {/* <div className='card-img-div'>
 </div>  */}
  <img src={props.image} alt='card-img' className='card-icon'/>
 </div>
 <div className='card-course-details'>
 <h5 className='course-name'>{props.heading}</h5>
<div className='course-time'>
    <h6 className='course-date' >{props.date}</h6>
    <h6 className='course-date'>{props.time}</h6>

</div>
<h6 className='course-date'>{props.duration}</h6>
<button className='enroll-btn' onClick={()=>navigate('/qaautomation')}>View Details</button>
 </div>
</div>
  </>
  )
}
export default TrainingCard
