import React, { useEffect , useState, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import ApplyDetails from './ApplyDetails';
import ApplyForm from './ApplyForm';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { FaArrowUp } from 'react-icons/fa';
import jobdetails from '../../Assets/apply.png';
import { MdKeyboardArrowRight } from "react-icons/md";
const JobDetails = () => {
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
                  <li className="breadcrumb-item">
                    <a href="/career">Career</a> <MdKeyboardArrowRight />{" "}
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Job Details
                  </li>
                </ol>
              </nav>
              <div >
                <img className='career-banner-img' src={jobdetails} alt='Apply Banner' />
                <div className="career-part">
                <ApplyDetails/>
                <ApplyForm/>
                </div>
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

export default JobDetails