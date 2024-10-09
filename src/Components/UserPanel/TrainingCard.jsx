import React from 'react'
import './Home.css';
import { FaCircle } from "react-icons/fa";
import imageUrl from '../../Assets/course_card2.png';


 const TrainingCard = (props) => {
  return (
  <>
<div className="card" >
 <div className='card-header-div'>
 
 <img src={imageUrl} alt="Card" className="card-image" />
 <div className='card-header'>
  {/* <p className='card-header-content'> */}
  <FaCircle style={{color:'rgba(16, 201, 0, 1)',marginRight:'1vh',height:'1.5vh',width:'0.8vw'}}/>Live Demo</div>
  {/* <div className='card-img-div'>
 </div>  */}
  <img src={props.image} alt='card-img' className='card-icon'/>
 </div>
 <div className='course-details'>
 <h5 className='course-name'>{props.heading}</h5>
<div className='course-time'>
    <h6 className='course-date' >{props.date}</h6>
    <h6 className='course-date'>{props.time}</h6>

</div>
<h6 className='course-date'>{props.duration}</h6>
<button className='enroll-btn'>View Details</button>
 </div>
</div>
  </>
  )
}
export default TrainingCard
