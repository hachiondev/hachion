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
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import HomeFaq from './HomeFaq';
import CorporateContactUs from './CorporateContactUs';

const CorporateTraining = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const advisorRef = useRef(null); // Create a ref for Advisor
  const scrollToCorporateTrainingForm = () => {
    if (advisorRef.current) {
      advisorRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to Advisor section smoothly
    }
  };

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 1000) {
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
  if (location.state?.scrollToCorporateTrainingForm) {
    setTimeout(() => {
      scrollToCorporateTrainingForm();
    }, 100);
  }
}, [location.state]);

  return (
    <>
      <Topbar />
      <div className='corporate-training'>
        <NavbarTop />
        <CorporateBanner onContactUsClick={scrollToCorporateTrainingForm} /> {/* Pass the scroll function as a prop */}
        <Association />
        <CorporateTrainingFeature />
        {/* <Hachion /> */}
        <LeadingExpert />
        <CustomizeTraining />
        <Learners page="home"/>
        <CorporateContactUs/>
        <HomeFaq/>
        {/* <div ref={advisorRef}>
          <CorporateTrainingForm />
        </div> */}
      </div>
      <Footer />

            {showScrollButton && (
              <button className="scroll-to-top" onClick={scrollToTop}>
                <FaArrowUp />
              </button>
            )}
            
      {showScrollButton && <StickyBar />}
    </>
  );
};

export default CorporateTraining;