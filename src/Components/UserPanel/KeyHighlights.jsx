import React from 'react'
import './Course.css'
import LiveOnline from '../../Assets/la_chalkboard-teacher.png';
import LiveVideo from '../../Assets/ri_live-line.png';
import LiveProject from '../../Assets/heroicons_rocket-launch.png';
import JobAssistance from '../../Assets/marketeq_work.png';
import Resume from '../../Assets/mi_document.png';
import Certification from '../../Assets/tabler_certificate.png'

const KeyHighlights = () => {
  return (
    <>
   <div className='key-highlights'>
   <p className='amount'>Key Highlights</p>
   <div className='key-highlights-header'>
    <div className='key-highlights-content'>
        <img src={LiveOnline} alt='teaching-online' className='key-icons'/>
        <p className='key-highlights-para'>30 Hours of Live online Training</p>
    </div>
    <div className='key-highlights-content'>
        <img src={LiveVideo} alt='video' className='key-icons'/>
        <p className='key-highlights-para'>30 Hours of recorded videos</p>
    </div>
    <div className='key-highlights-content'>
        <img src={LiveProject} alt='live-projects' className='key-icons'/>
        <p className='key-highlights-para'>Live Projects & Exercises</p>
    </div>
    <div className='key-highlights-content'>
        <img src={JobAssistance} alt='job-assistance'  className='key-icons'/>
        <p className='key-highlights-para'>Job Assistance </p>
    </div>
    <div className='key-highlights-content'>
        <img src={Resume} alt='Resume' className='key-icons'/>
        <p className='key-highlights-para'>Resume & Interview Assistance</p>
    </div>
    <div className='key-highlights-content'>
        <img src={Certification} alt='certification' className='key-icons'/>
        <p className='key-highlights-para'>Certification</p>
    </div>

   </div>
   </div>
    </>
  )
}

export default KeyHighlights