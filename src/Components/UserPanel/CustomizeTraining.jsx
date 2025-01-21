import React from 'react';
import img1 from '../../Assets/image.png';
import img2 from '../../Assets/image27.png';
import './Corporate.css';

const CustomizeTraining = () => {
  return (
   <>
   <div className='association'>
    <h1 className='association-head'>Customized Training to Fit Your Needs</h1>
    </div>
    <div className='customize-training'>
        <div className='customize-training-div'>
            <img src={img1} alt='customize-training-image'/>
            <p className='customize-training-div-content'>Instructor-Led Live, Online Training</p>
        </div>
        <div className='customize-training-div'>
            <img src={img2} alt='customize-training-image2'/>
            <p className='customize-training-div-content'>Blended Training</p>
        </div>
    </div>
   </>
  )
}

export default CustomizeTraining
