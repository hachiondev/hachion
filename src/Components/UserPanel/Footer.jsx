import React from 'react'
import facebook from '../../Assets/facebook.png';
import twitter from '../../Assets/twitter.png';
import youtube from '../../Assets/youtube.png';
import linkedin from '../../Assets/linkedin.png';
import instagram from '../../Assets/instagram.png';
import quora from '../../Assets/Component 141.png';
import {  useNavigate } from 'react-router-dom';
import './Home.css';

const Footer = () => {
  const navigate= useNavigate();
  const handleBlog=()=>{
  navigate('/blogs')
  }
  const handleQA=()=>{
    navigate('/qatesting')
  }
  const handleSalesforce=()=>{
    navigate('/salesforce')
  }
  const handleAbout=()=>{
    navigate('/aboutus')
  }
  const handleContact=()=>{
    navigate('/contactus')
  }
   const handleTerms=()=>{
    navigate('/terms')
  }
   const handlePrivacy=()=>{
    navigate('/privacy')
  }
  return (
    
    <div className='footer'>
      <div className='footer-top'>
    <div className='footer-head'>
    <p className='footer-heading'>Top Courses</p>
    <p className='footer-content'>AWS SysOps Admin</p>
    <p className='footer-content'>DevOps</p>
    <p className='footer-content'>Python</p>
    <p className='footer-content'>Salesforce Admin</p>
    <p className='footer-content'>More...</p>
</div>
<div className='footer-head'>
    <p className='footer-heading'>Popular Courses</p>
    <p className='footer-content'>Google Cloud</p>
    <p className='footer-content'>Tableau</p>
    <p className='footer-content' onClick={handleSalesforce}>Salesforce Developer</p>
    <p className='footer-content'>Java Full Stack Development</p>
    <p className='footer-content'>More...</p>
</div>
    
<div className='footer-head'>
    <p className='footer-heading'>Training Categories</p>
    <p className='footer-content'>Cloud Computing</p>
    <p className='footer-content'>RPA</p>
    <p className='footer-content'>Big Data</p>
    <p className='footer-content' onClick={handleQA}>QA Testing</p>
    <p className='footer-content'>More...</p>
    </div>
    <div className='footer-head'>
    <p className='footer-heading'>Hachion</p>
    <p className='footer-content' onClick={handleAbout}>About us</p>
    <p className='footer-content' onClick={handleContact}>Contact us</p>
    <p className='footer-content'>Careers</p>
    <p className='footer-content' onClick={handleBlog}>Blog</p>
    <p className='footer-content'>Internship</p>
    <p className='footer-content'>Sitemap</p>
    </div>
      </div>
      <hr  size='2' />
      <div className='footer-bottom'>
      <div className='footer-p'>
      <p className='footer-copyright'>© Hachion 2024. All Rights Reserved.</p>
      <div className='term'>
      <p className='footer-term' onClick={handleTerms}>Terms and Conditions</p>
      <p className='footer-term' onClick={handlePrivacy}>Privacy Policy</p>
      </div>
      <div className='footer-link'>
      <a href="https://www.facebook.com/hachion.co" 
    target="_blank" 
    rel="noopener noreferrer"><img src={facebook} alt='facebook-icon'/></a>
    <a href="https://x.com/hachion_co" 
    target="_blank" 
    rel="noopener noreferrer"><img src={twitter} alt='twitter-icon'/></a>
    <a href="https://www.linkedin.com/company/hachion" 
    target="_blank" 
    rel="noopener noreferrer"><img src={linkedin} alt='linkedin-icon'/></a>
    <a href="https://www.instagram.com/hachion_trainings" 
    target="_blank" 
    rel="noopener noreferrer"><img src={instagram} alt='instagram-icon'/></a>
    <a href="https://www.quora.com/profile/Hachion-4" 
    target="_blank" 
    rel="noopener noreferrer"><img src={quora} alt='quora-icon'/></a>
      <a href="https://www.youtube.com/@hachion" 
    target="_blank" 
    rel="noopener noreferrer"><img src={youtube} alt='youtube'/></a>
      </div>
      </div>
      </div>
    </div>
  )
}

export default Footer