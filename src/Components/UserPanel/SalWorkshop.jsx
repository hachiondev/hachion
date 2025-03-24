import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import { useParams } from 'react-router-dom';
import './Course.css';
import Footer from './Footer';
import StickyBar from './StickyBar';
import Banner2 from '../../Assets/bann3.png';
import Exp from '../../Assets/exp.png';
import Assig from '../../Assets/assig.png';
import Handexp from '../../Assets/handexp.png';
import cv from '../../Assets/cv.png';
import inter from '../../Assets/inter.png';
import support from '../../Assets/247.png';
import salreg from '../../Assets/salreg.png';
import WorkshopLearners from './WorkshopLearners';
import WorkshopFAQ from './WorkshopFAQ';
import './Blogs.css';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import {AiFillCaretDown } from 'react-icons/ai';
import axios from "axios";

const SalWorkshop = () => {
  const [workshop, setWorkshop] = useState({
    date: "",
    time: "",
    timezone: "",
  });
  const footerRef = useRef(null); // Footer reference for intersection observer
  const workshopRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const[email,setEmail]=useState("");
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [mobile,setMobile]=useState("");
  const mobileInputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState({
      code: '+1',
      flag: 'US',
      name: 'United States',
    });
  
    const countries = [
      { name: 'India', code: '+91', flag: 'IN' },
      { name: 'United States', code: '+1', flag: 'US' },
      { name: 'United Kingdom', code: '+44', flag: 'GB' },
      { name: 'Thailand', code: '+66', flag: 'TH' },
      { name: 'Canada', code: '+1', flag: 'CA' },
      { name: 'Australia', code: '+61', flag: 'AU' },
      { name: 'Germany', code: '+49', flag: 'DE' },
      { name: 'France', code: '+33', flag: 'FR' },
      { name: 'United Arab Emirates', code: '+971', flag: 'AE' },
      { name: 'Qatar', code: '+974', flag: 'QA' },
      { name: 'Japan', code: '+81', flag: 'JP' },
      { name: 'China', code: '+86', flag: 'CN' },
      { name: 'Russia', code: '+7', flag: 'RU' },
      { name: 'South Korea', code: '+82', flag: 'KR' },
      { name: 'Brazil', code: '+55', flag: 'BR' },
      { name: 'Mexico', code: '+52', flag: 'MX' },
      { name: 'South Africa', code: '+27', flag: 'ZA' },
    ];
    
    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
      closeMenu();
      mobileInputRef.current?.focus();
    };
  
    const openMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const closeMenu = () => {
      setAnchorEl(null);
    };
  
    const handleScrollToWorkshop = () => {
      if (workshopRef.current) {
        workshopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsSticky(false);
            }
          });
        },
        { rootMargin: '0px', threshold: 0.1 }
      );
  
      if (footerRef.current) {
        observer.observe(footerRef.current);
      }
  
      return () => {
        if (footerRef.current) {
          observer.unobserve(footerRef.current);
        }
      };
    }, []);

    useEffect(() => {
    // Fetching workshop details from the backend
    axios.get("https://api.hachion.co/workshop")
      .then(response => {
        setWorkshop(response.data);
      })
      .catch(error => {
        console.error("Error fetching workshop details:", error);
      });
  }, []);

  return (
    <>
    <Helmet>
        <title>Best Salesforce Training & Workshop in USA | Expert Guidance</title>
        <meta name="description" content="Unlock your potential with our expert-led Salesforce training & workshop in USA. Enhance skills, boost career & transform businesses." />
        <meta name="keywords" content="Salesforce Training, Salesforce Workshop, USA Salesforce Training, Expert Guidance, Career Development" />
      </Helmet>
      <Topbar />
      <NavbarTop />
      <div className='course-top'>
        <div className='about-banner'>
          <img src={Banner2} alt="Banner2" onClick={handleScrollToWorkshop}/>
        </div>

        <div className='workshop-content'>
          <h2 className='workshop-heading'>About training program</h2>
          <div className='workshop-top'>
            <div className='workshop-left-content'>
              <h3 className='workshop-text'>Key Takeaways</h3>
              <p><b>By participating along with us in the workshop, you'll learn:</b></p>
              <ul>
                <li>Learn the core concepts, architecture, and key features of Salesforce CRM.</li>
                <li>Gain practical knowledge with live demonstrations and real-world scenarios.</li>
                <li>Explore Salesforce automation tools like Flow, Process Builder, and Reports & Dashboards.</li>
                <li>Discover career paths like Salesforce Admin, Developer, and Business Analyst.</li>
                <li>Get guidance on Salesforce certifications to fast-track your career.</li>
                <li>See how top companies leverage Salesforce for customer management and business growth.</li>
                <li>Learn about in-demand Salesforce roles, salary trends, and career growth opportunities.</li>
              </ul>

              <p><b>Is This Workshop for Me?</b></p>
              <p>
                This workshop is designed for individuals who want to gain hands-on experience with Salesforce CRM and build practical skills for real-world business solutions. By the end of this workshop, you'll be equipped to build business automation solutions, understand Salesforce architecture, and take your first steps toward Salesforce certifications.
              </p>
            </div>

            <div className='workshop-left-content'>
              <h3 className='workshop-text'>Workshop Details</h3>
              <div className='workshop-text-details'>
                {/* <p>Date: {workshop.date}</p>
                <p>Time: {workshop.time} {workshop.timezone}</p> */}
                <p>Date: 15th March</p>
                <p>Time: 10AM EST</p>
                <p>(4 Days a Week: Monday - Thursday)</p>
                  <p>Time Duration: 1 Hour Daily</p>
                  {/* <p>Workshop Duration: 1 Month</p> */}
              </div>

              <ul>
                <li>What is the outline of the Training Program</li>
                <li>Live case study</li>
                <li>How can you make a career as a Salesforce professional</li>
                <li>How to crack the interviews - mantras for your case rounds</li>
                <li>Live Q&A</li>
              </ul>

              <p><b>Any Prerequisites?</b></p>
              <ul>
                <li>Basic Computer Skills</li>
                <li>Understanding of Business Processes</li>
                <li>Problem-Solving Mindset</li>
                <li>Curiosity to Learn</li>
              </ul>
            </div>
          </div>
        </div>

      <div className='workshop-banner'onClick={handleScrollToWorkshop}>
                    <p className='workshop-banner-content'>Register Now Before Seats Run Out !</p>
                    <button className='join' onClick={handleScrollToWorkshop}>Join Now</button>
                  </div>

            <div className='workshop-content'>
          <h2 className='workshop-heading'>Program Highlights</h2>
          <div className='workshop-top-img'>
            <div className='about-us-div-content'>
                <img className='workshop-img' src={Exp} alt='' />
                <h6>Expert Guidance</h6>
              </div>
              <div className='about-us-div-content'>
                <img className='workshop-img' src={Assig} alt='' />
                <h6>Assignment Practices</h6>
              </div>
              <div className='about-us-div-content'>
                <img className='workshop-img' src={Handexp} alt='' />
                <h6>Hands on Projects</h6>
              </div>
            </div>

            <div className='workshop-top-img'>
            <div className='about-us-div-content'>
                <img className='workshop-img' src={cv} alt='' />
                <h6>Resume Building</h6>
              </div>
              <div className='about-us-div-content'>
                <img className='workshop-img' src={inter} alt='' />
                <h6>Interview Preparation</h6>
              </div>
              <div className='about-us-div-content'>
                <img className='workshop-img' src={support} alt='' />
                <h6>24/7 Support</h6>
              </div>
            </div>
        </div>

        <WorkshopLearners />

        <div className='workshopfaq'>
        <WorkshopFAQ />
        </div>

        <div className='workshopform' ref={workshopRef}>
        <div className='workshop-content'>
          <h2 className='workshop-reg'>Join the Workshop Now!</h2>
          <div className='workshop-top-img'>
          <img className='workshop-reg-img' src={salreg} alt='' />

          <div>
          <div className='join-form'>
            <div className="form-group col-10" style={{marginBottom: '20px'}}>
          <label htmlFor="inputName" className="form-label">
          Full Name<span className='star'>*</span>
          </label>
          <input
            id="query1"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control-query"
            placeholder="Enter your name"
          />
        </div>

         <div className="form-group col-10" style={{marginBottom: '20px'}}>
          <label htmlFor="inputEmail" className="form-label">
            Email ID<span className='star'>*</span>
          </label>
          <input
            id="query1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control-query"
            placeholder="abc@gmail.com"
          />
        </div>

        <div className="form-group col-10" style={{marginBottom: '20px'}}>
           <label className="form-label">Mobile Number</label>
                   <div className="input-group mb-3 custom-width">
                     <div className="input-group">
                       <Button
                         variant="outlined"
                         onClick={openMenu}
                         className="country-code-dropdown"
                         endIcon={<AiFillCaretDown />}
                         style={{backgroundColor: '#FFF'}}
                       >
                         <Flag code={selectedCountry.flag} className="country-flag" />
                         {selectedCountry.code}
                       </Button>
           
                       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                         {countries.map((country) => (
                           <MenuItem
                             key={country.code}
                             onClick={() => handleCountrySelect(country)}
                           >
                             <Flag code={country.flag} className="country-flag" />
                             {country.name} ({country.code})
                           </MenuItem>
                         ))}
                       </Menu>
           
                       <input
                         type="tel"
                         className="mobile-number"
                         ref={mobileInputRef}
                         aria-label="Text input with segmented dropdown button"
                         id="workshop"
                         value={mobile}
                         onChange={(e) => setMobile(e.target.value)}
                         placeholder="Enter your mobile number"
                       />
                     </div>
                   </div>
                   </div>

           <div className='form-group col-10' style={{ position: 'relative' }}>
             <label for="inputState" className='form-label'>
              Time Zone<span className="star">*</span>
            </label>
            {/* <div className="input-group mb-2"> */}
              <select id='query1' class="form-select mode" value={zone}
            onChange={(e) => setZone(e.target.value)}>
            <option selected>Select Time Zone</option>
            <option>EST</option>
            <option>CST</option>
            <option>MST</option>
            <option>PST</option>
          </select>
            </div>
            </div>

            <button
              type="button"
              className="register-button"
            >
              Register
            </button>
            </div>
        </div>
        </div>
        </div>

      {/* Footer section to stop the sticky behavior */}
      <div ref={footerRef}>
        <Footer />
      </div>
      <StickyBar />
      </div>
    </>
  );
};

export default SalWorkshop;