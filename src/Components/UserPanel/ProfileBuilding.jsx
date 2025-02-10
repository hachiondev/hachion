import React from 'react';
import CareerImage from '../../Assets/la_chalkboard-teacher.png';
import Resume from '../../Assets/streamline_business-user-curriculum.png';
import './Course.css';


const ProfileBuilding = () => {
  return (<>
  <div className='profile-building'>
  <div className='profile-building-div'>
  
    <img src={CareerImage} alt='career-image' /> 
    <div>
    <h5 > Career Oriented Sessions</h5>
    <p >Over 10+ live interactive sessions with an 
        industry expert to gain knowledge and experience on how to build skills 
        that are expected by hiring managers. These will be guided sessions that 
        will help you stay on track with your upskilling.</p>
        </div>
        </div>
        <div className='profile-building-div'>
          <img src={Resume} alt='resume-image'/>
          <div >
   <h5 > Resume & LinkedIn Profile Building</h5>
   <p >Get assistance in creating a world-class resume
     & Linkedin Profile from our career services team and learn how to grab the 
     attention of the hiring manager 
    at the profile shortlisting stage</p>
    </div>
    </div>
    </div>
    </>
  )
}

export default ProfileBuilding