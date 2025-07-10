import React, { useEffect , useState, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import JobsDisplay from './JobsDisplay';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { FaArrowUp } from 'react-icons/fa';
import careerjob from '../../Assets/careerbanner.png';
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
const ApplyHiring = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    
      useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 300) {
            setShowScrollButton(true);
          } else {
            setShowScrollButton(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    const scrollToTop = () => {
    console.log("Scroll to top clicked!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div>
      <div className='home-background'>
      <Topbar/>
      <NavbarTop/>
      <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a> <MdKeyboardArrowRight />{" "}
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Career
                  </li>
                </ol>
              </nav>
              <div >
                <img className='career-banner-img' src={careerjob} alt='Career Banner' />

            <h2 className='summer-title'>We're Hiring!</h2>
            <div className='hire-part'>
              <p className='career-job-text'>
            Interested in working with us? Email your resume to <span className='career-span'><a
            href="https://mail.google.com/mail/?view=cm&to=hr@hachion.co"
            target="_blank"
            rel="noopener noreferrer"
          > hr@hachion.co </a></span>
            <br/>
            You can also view our current job listings and apply to the one that best suits your experience.
            </p>
          </div>

          <div className="hire-part">
                      <div className="search-div-career" role="search">
                        <input
                          className="search-input-career"
                          type="search"
                          placeholder="Enter Job Title, Type, Location or Keywords"
                          aria-label="Search"
                        />
                        <button className="btn-search-home"  >
                          <IoSearch style={{ fontSize: '1.8rem' }} />
                        </button>
                      </div>
                      </div>
                <JobsDisplay/>
      <Footer/>
      {showScrollButton && (
              <button className="scroll-to-top" onClick={scrollToTop}>
                <FaArrowUp />
              </button>
            )}
      </div>
      </div>
      <StickyBar/>
    </div>
  )
}

export default ApplyHiring
