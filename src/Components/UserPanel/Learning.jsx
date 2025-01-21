import React from 'react'
import './Home.css';
import { FaChalkboardTeacher } from "react-icons/fa";
import {Link} from 'react-router-dom';
import { IoIosTime } from "react-icons/io";
import { PiCertificateFill } from "react-icons/pi";
import { GiTeamIdea } from "react-icons/gi";

 const Learning = () => {
  return (
   <>
   <div className='learning'>
<h2>Invest in your career with Hachion</h2>
<p className='features'>Get specialization in courses of IT industry, and Professional 
    Certificates taught by </p>
    <p className='features'>top instructors from leading universities and companies.</p>
<div className='feature-card'>
    <div className="card"  >
        <div className='icons'>
        <Link to ='#'><FaChalkboardTeacher /></Link>
        </div>
  <div className="card-body">
    <h5 className="card-title">Live Online Training</h5>
    <p className="card-text">Get Live interactive training from the convenience of your office or home...</p>
    
    </div>
  </div>
  <div className="card"  >
        <div className='icons'>
        <Link to ='#'><IoIosTime /></Link>
        </div>
  <div className="card-body">
    <h5 className="card-title">Flexible Timings</h5>
    <p className="card-text">Our training provides time flexibility according to own schedules...</p>
    
    </div>
  </div>
  <div className="card"  >
        <div className='icons'>
        <Link to ='#'><PiCertificateFill /></Link>
        </div>
  <div className="card-body">
    <h5 className="card-title">Certification Guidance</h5>
    <p className="card-text">Technical team will help you to get certificate in desired technologies...</p>
    
    </div>
  </div>
  <div className="card"  >
        <div className='icons'>
        <Link to ='#'><GiTeamIdea /></Link>
        </div>
  <div className="card-body">
    <h5 className="card-title">Mentor Support</h5>
    <p className="card-text">We strongly supports 1:1 mentor for professionals to meet their training needs...</p>
    
    </div>
  </div>
</div>
   </div>
   </>
  )
}
export default Learning;