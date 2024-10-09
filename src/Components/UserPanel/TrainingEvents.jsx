import React from 'react'
import TrainingCard  from './TrainingCard';
import './Home.css';
import cardimage1 from '../../Assets/Data Science.png';
import cardimage2 from '../../Assets/image 82.png';
import cardimage3 from '../../Assets/image 95.png';
import cardimage4 from '../../Assets/course.png';
import { useNavigate } from 'react-router-dom';

const TrainingEvents = () => {
  const navigate=useNavigate();
  return (
    <>
<div className='training-events'>
    <div className='training-events-head'>
<h1 className='association-head'>Upcoming Training Events</h1></div>
<div className='view-btn'>
<button className='view-all' onClick={()=>navigate('/course')}>View All</button>
</div>
<div className='training-card-holder'>
  
<TrainingCard heading='Datascience with python' image={cardimage1} date='Jul 26 2024' time='06:00 AM IST' duration='Duration: 1 hour'/>
<TrainingCard heading='Salesforce Admin' image={cardimage2} date='Jul 26 2024' time='06:00 AM IST' duration='Duration: 1 hour'/>
<TrainingCard heading='QA Manual Testing' image={cardimage3} date='Jul 26 2024' time='06:00 AM IST' duration='Duration: 1 hour'/>
<TrainingCard heading='Cyber Security' image={cardimage4} date='Jul 26 2024' time='06:00 AM IST' duration='Duration: 1 hour'/>
</div>

    </div>
    </>
  )
}

export default TrainingEvents