import React, { useRef } from 'react';
import image from '../../Assets/image 80.png';
import { MdOutlineStar } from "react-icons/md";
import qaheader from '../../Assets/qa-video.png';
import { IoPlayCircleOutline } from 'react-icons/io5';
import './Course.css';

const QaTop = ({ onVideoButtonClick }) => {
  return (
    <>
      <div className='qa-automation'>
        <div className='qa-left-part'>
          <div className='qa-automation-left'>
            <img src={image} alt='qa-image' />
            <div className='qa-automation-middle'>
              <p className='fee'>Fee: <span className='amount'>₹37383/-</span></p>
              <h6 className='sidebar-course-review'>Rating: 5.0 <MdOutlineStar className='star-icon' />
                <MdOutlineStar className='star-icon' /><MdOutlineStar className='star-icon' />
                <MdOutlineStar className='star-icon' /><MdOutlineStar className='star-icon' /> (100)
              </h6>
            </div>
          </div>
          <div className='qa-content'>
            <p>Quality Assurance (QA) Automation is a vital aspect of modern software
              development, ensuring that applications are properly tested for quality
              before release. At Hachion, we offer the top QA automation training in
              the United States, equipping you with the skills and information required to flourish in this crucial profession.</p>
          </div>
          <div className='qa-button'>
            <button className='enroll-now'>Enroll Now</button>
            <button className='download'>Download Brochure</button>
          </div>
        </div>
        <div className='qa-right'>
          <p className='certified'>Certified-students: 57</p>
          <img src={qaheader} alt='video-frame' />
          <button className='video-btn' onClick={onVideoButtonClick}>
            <IoPlayCircleOutline style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700',marginRight:'10px' }} />
            Watch Demo Videos
          </button>
        </div>
      </div>
    </>
  );
}

export default QaTop;
