import React, { useEffect, useState } from 'react';
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
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const response = await fetch('https://api.hachion.co/trendingcourse');
        const data = await response.json();
        // Filter courses with status true
        const activeCourses = data.filter(course => course.status === true);
        setCourses(activeCourses);
      } catch (error) {
        console.error('Error fetching trending courses:', error);
      }
    };

    fetchTrendingCourses();
  }, []);

  const handleNavigation = (courseName) => {
    const formattedName = courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${formattedName}`);
  };

  const handleBlog=()=>{
  navigate('/blogs')
  window.scrollTo(0, 0);
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
  const handleWorkshop=()=>{
    navigate('/workshop')
    window.scrollTo(0, 0);
  }
   const handleKidsSummer=()=>{
    navigate('/summer-tech-bootcamp-for-teens')
  }
  const handleSitemap = () => {
    navigate("/sitemap")
    window.scrollTo(0, 0);;
  };
  const handleUnsubscribe = () => {
    navigate("/unsubscribe");
  };
  return (
    
    <div className='footer'>
      <div className='footer-top'>
    <div className='footer-head'>
    <p className='footer-heading'>Trending Courses</p>
    <div className="footer-row">
    {courses.length > 0 ? (
          courses.map((course, index) => (
            <React.Fragment key={course.trendingcourse_id}>
              <p
                className='footer-content'
                onClick={() => handleNavigation(course.course_name)}
                style={{ cursor: 'pointer' }}
              >
                {course.course_name}
              </p>
              {index !== courses.length - 1 && <span>|</span>}
            </React.Fragment>
          ))
        ) : (
          <p>No active courses available.</p>
        )}
      </div>
    </div>
    
    <div className='footer-head'>
    <p className='footer-heading'>Hachion</p>
    <div className="footer-row">
  <p className="footer-content" onClick={handleAbout}>About us</p>
  <span>|</span>
  <p className="footer-content" onClick={handleContact}>Contact us</p>
  <span>|</span>
  {/* <p className="footer-content" onClick={() => window.open("https://hachtechnologies.com/", "_blank")}>Careers</p>
  <span>|</span> */}
  <p className="footer-content" onClick={handleBlog}>Blog</p>
  <span>|</span>
  {/* <p className="footer-content">Internship</p>
  <span>|</span> */}
  <p className="footer-content" onClick={handleSitemap}>Sitemap</p>
  <span>|</span>
  <p className="footer-content" onClick={handleWorkshop}>Workshop</p>
  <span>|</span>
  <p className="footer-content" onClick={handleKidsSummer}>Kids Summer Training</p>
</div>
    </div>
      </div>
      <hr  size='2' />
      <div className='footer-bottom'>
      <div className='footer-p'>
      <p className='footer-copyright'>© Hachion 2025. All Rights Reserved.</p>
      <div className='term'>
      <p className='footer-term' onClick={handleTerms}>Terms and Conditions</p>
      <p className='footer-term' onClick={handlePrivacy}>Privacy Policy</p>
      <p className="footer-term" onClick={handleUnsubscribe}>Unsubscribe</p>
      </div>
      <div className='footer-link'>
      <a href="https://www.facebook.com/hachion.co" aria-label="Facebook"
    target="_blank" 
    rel="noopener noreferrer"><img src={facebook} alt='facebook-icon' loading="lazy"/></a>
    <a href="https://x.com/hachion_co" aria-label="Twitter"
    target="_blank" 
    rel="noopener noreferrer"><img src={twitter} alt='twitter-icon' loading="lazy"/></a>
    <a href="https://www.linkedin.com/company/hachion" aria-label="Linkedin"
    target="_blank" 
    rel="noopener noreferrer"><img src={linkedin} alt='linkedin-icon' loading="lazy"/></a>
    <a href="https://www.instagram.com/hachion_trainings" aria-label="Instagram"
    target="_blank" 
    rel="noopener noreferrer"><img src={instagram} alt='instagram-icon' loading="lazy"/></a>
    <a href="https://www.quora.com/profile/Hachion-4" aria-label="Quora"
    target="_blank" 
    rel="noopener noreferrer"><img src={quora} alt='quora-icon' loading="lazy"/></a>
      <a href="https://www.youtube.com/@hachion" aria-label="YouTube"
    target="_blank" 
    rel="noopener noreferrer"><img src={youtube} alt='youtube' loading="lazy"/></a>
      </div>
      </div>
      </div>
    </div>
  )
}

export default Footer