import React, { useEffect , useState, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import CorporateBanner from './CorporateBanner';
import Association from './Association';
import Hachion from './Hachion';
import CustomizeTraining from './CustomizeTraining';
import LeadingExpert from './LeadingExpert';
import Footer from './Footer';
import StickyBar from './StickyBar';
import CorporateTrainingFeature from './CorporateTrainingFeature';
import Learners from './Learners';
import Advisor from './Advisor';
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const CorporateTraining = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const advisorRef = useRef(null); // Create a ref for Advisor
  const scrollToAdvisor = () => {
    if (advisorRef.current) {
      advisorRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to Advisor section smoothly
    }
  };

  // Handle Scroll - Show/Hide Button
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
  
    // Scroll to top function
    const scrollToTop = () => {
      console.log("Scroll to top clicked!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const location = useLocation();

useEffect(() => {
  if (location.state?.scrollToAdvisor) {
    setTimeout(() => {
      scrollToAdvisor();
    }, 100);
  }
}, [location.state]);

  return (
    <>
      <Topbar />
      <div className='corporate-training'>
        <NavbarTop />
        <CorporateBanner onContactUsClick={scrollToAdvisor} /> {/* Pass the scroll function as a prop */}
        <Association />
        <Hachion />
        <CustomizeTraining />
        <LeadingExpert />
        <CorporateTrainingFeature />
        <Learners />
        <div ref={advisorRef}>
          <Advisor /> {/* Set the ref to Advisor component */}
        </div>
      </div>
      <Footer />

      {/* Scroll to Top Button */}
            {showScrollButton && (
              <button className="scroll-to-top" onClick={scrollToTop}>
                <FaArrowUp />
              </button>
            )}
            
      <StickyBar />
    </>
  );
};

export default CorporateTraining;
