import React from 'react'
import CareerImage from '../../Assets/interview.png';
import mentorImage from '../../Assets/mentor.png';
import './Course.css'

const InterviewPreparation = () => {
  return (
   <>
     <div className='profile-building'>
      <div className='profile-building-div'>
        <img src={CareerImage} alt='mock-interview'/>
        <div>
    <h5>  Mock Interview Preparation</h5>
    <p>Students will go through a number of mock interviews conducted by technical experts who will then offer tips and constructive feedback for reference and improvement.</p>
   </div>
   </div>
   <div className='profile-building-div'>
   <img src={mentorImage} alt='mock-interview'/>
   <div>
   <h5 >  1 on 1 Career Mentoring Sessions</h5>
   <p >Attend one-on-one sessions with career mentors on how to develop the required skills and attitude to secure a dream job based on a learner’s 
    educational background, past experience, and future career aspirations.</p>
    </div>
    </div>
    </div>
   </>
  )
}

export default InterviewPreparation