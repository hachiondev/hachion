import React, { useEffect, useState } from 'react';
import FooterLogo from '../../Assets/Logowhite.webp';
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import {  useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import './Home.css';

const Footer = () => {
  const navigate= useNavigate();
  const [courses, setCourses] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');

  // useEffect(() => {
  //     const detectUserCountry = async () => {
  //       try {
  //         const res = await fetch('https://ipwhowho.is/');
  //         if (!res.ok) throw new Error('Failed to fetch location data');
  
  //         const data = await res.json();
  //         if (data.country_code === 'IN') {
  //           setWhatsappNumber('+91-949-032-3388');
  //           setWhatsappLink('https://wa.me/919490323388');
  //         } else {
  //           setWhatsappNumber('+1 (732) 485-2499');
  //           setWhatsappLink('https://wa.me/17324852499');
  //         }
  //       } catch (error) {
  //         setWhatsappNumber('+1 (732) 485-2499');
  //         setWhatsappLink('https://wa.me/17324852499');
  //       }
  //     };
  
  //     detectUserCountry();
  //   }, []);
  useEffect(() => {
  const detectUserCountry = async () => {
    try {
      const res = await fetch('https://api.country.is');
      if (!res.ok) throw new Error('Failed to fetch location data');

      const data = await res.json();
      data.country_code = (data.country || '').toUpperCase();

      if (data.country_code === 'IN') {
        setWhatsappNumber('+91-949-032-3388');
        setWhatsappLink('https://wa.me/919490323388');
      } else {
        setWhatsappNumber('+1 (732) 485-2499');
        setWhatsappLink('https://wa.me/17324852499');
      }
    } catch (error) {
      setWhatsappNumber('+1 (732) 485-2499');
      setWhatsappLink('https://wa.me/17324852499');
    }
  };

  detectUserCountry();
}, []);


  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const response = await fetch('https://api.test.hachion.co/trendingcourse');
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
      <style>
        {`
          .email-input {
            background-color: #1F1F1F !important;
          }
        `}
      </style>
      <div className="container">
      <div className='footer-top'>

    <div className='footer-logo-head'>
    <p className='footer-heading'><img src={FooterLogo} alt='Logo' loading="lazy"/></p>
    {/* <div className="footer-column"> */}
  <div className="footer-subscribe">Subscribe to our newsletter</div>
                <div className="footer-email">
                <input
                  type="email"
                  className="form-control email-input"
                  placeholder="Email Address"
                  style={{backgroundColor: '#1F1F1F', borderBottom: '1px solid #fff', boxShadow: 'none', borderRadius: '0'}}
                />
                <span className="arrow" aria-label="send"><IoIosArrowForward /></span>
                </div>
      <div className='desktop-query'>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-white me-3"
            aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
          >
            <FaPhone className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">{whatsappNumber}</span>
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-white"
            aria-label="Send an email to trainings@hachion.co using Gmail"
          >
            <IoIosMail className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">trainings@hachion.co</span>
          </a>
      </div>
      {/* </div> */}
    </div>

    <div className='footer-head'>
    <p className='footer-heading'>Trending Courses</p>
    <div className="footer-column">
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
            </React.Fragment>
          ))
        ) : (
          <p>No active courses available.</p>
        )}
      </div>
    </div>
    
    <div className='footer-head'>
    <p className='footer-heading'>Hachion</p>
    <div className="footer-column">
  <p className="footer-content" onClick={handleAbout}>About us</p>
  <p className="footer-content" onClick={handleContact}>Contact us</p>
  {/* <p className="footer-content" onClick={() => window.open("https://hachtechnologies.com/", "_blank")}>Careers</p>
  <span>|</span> */}
  <p className="footer-content" onClick={handleBlog}>Blog</p>
  {/* <p className="footer-content">Internship</p>
  <span>|</span> */}
  <p className="footer-content" onClick={handleSitemap}>Sitemap</p>
  <p className="footer-content" onClick={handleWorkshop}>Workshop</p>
  <p className="footer-content" onClick={handleKidsSummer}>Kids Summer Training</p>
</div>
    </div>

    <div className='footer-head'>
    <p className='footer-heading'>Hachion</p>
    <div className="footer-column">
  <p className="footer-content" onClick={handleTerms}>Terms and Conditions</p>
  <p className="footer-content" onClick={handlePrivacy}>Privacy Policy</p>
  <p className="footer-content" onClick={handleUnsubscribe}>Unsubscribe</p>
</div>
    </div>

    <div className='mobile-query'>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-white me-3"
            aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
          >
            <FaPhone className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">{whatsappNumber}</span>
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-white"
            aria-label="Send an email to trainings@hachion.co using Gmail"
          >
            <IoIosMail className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">trainings@hachion.co</span>
          </a>
      </div>
      </div>
      </div>
    </div>
  )
}

export default Footer