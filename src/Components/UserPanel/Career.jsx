import React from 'react'
import './Home.css';
import img1 from '../../Assets/image 72.png';
import img2 from '../../Assets/image 69.png';
import img3 from '../../Assets/image 68.png';
import img4 from '../../Assets/image 70.png';

const Career = () => {
  
    
  return (
   <>
   <div className='training-events'>
    <div className='training-events-head'>
<h1 className='association-head'>Hachion enhances career advancement</h1></div>
<div className='career-div'>
<div className='online-training-div'>
   <img src={img1} alt='image1'/>
   <h3 className='Live-online'>Live online Training</h3>
   <p className='training-content'>Get Live interactive training from the convenience of your office or home.</p>

</div>
<div className='online-training-div'>
   <img src={img2} alt='image1'/>
   <h3 className='Live-online'>Flexible Timings</h3>
   <p className='training-content'>Our training programs provides learners flexibility to schedule on their own schedules.</p>

</div>
<div className='online-training-div'>
   <img src={img3} alt='image1'/>
   <h3 className='Live-online'>Certification Guidance</h3>
   <p className='training-content'>Technical team will help you to get certified in desired technologies.</p>

</div>
<div className='online-training-div'>
   <img src={img4} alt='image1'/>
   <h3 className='Live-online'>Mentoring Support</h3>
   <p className='training-content'>We strongly supports mentoring mode for busy professionals to meet their training needs.</p>

</div>
   </div>
</div>

   
   </>
  )
}

export default Career