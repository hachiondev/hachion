import React from 'react'
import CareerImage from '../../Assets/career-support.png';
import accessImage from '../../Assets/access.png';
const JobAssistance = () => {
  return (
    <>
      <div className='profile-building'>
        <div className='profile-building-div'>
          <img src={CareerImage} alt='placement'/>
          <div>
     <h5>  Placement Assistance</h5>
    <p>Placement opportunities are provided once the learner is moved to the placement pool upon clearing Placement Readiness Test (PRT)</p>
   </div>
   </div>
        <div className='profile-building-div'>
          <img src={accessImage} alt='placement'/>
          <div>
   <h5> Exclusive access to Hachion Job portal</h5>
   <p className='career-session'>Exclusive access to our dedicated job portal and apply for jobs. More than 400 hiring partners’ including top start-ups and product companies hiring our learners. Mentored support on job search and relevant jobs for your career growth.</p>
   </div>
   </div>
   </div>
    </>
  )
}

export default JobAssistance