import React, { useEffect , useState, useRef } from 'react';
import CorporateBanner from './CorporateBanner';
import Association from './Association';
import Hachion from './Hachion';
import CustomizeTraining from './CustomizeTraining';
import LeadingExpert from './LeadingExpert';
import CorporateTrainingFeature from './CorporateTrainingFeature';
import Learners from './Learners';
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import HomeFaq from './HomeFaq';
import CorporateContactUs from './CorporateContactUs';

const CorporateTraining = () => {
  const advisorRef = useRef(null); // Create a ref for Advisor
  const scrollToCorporateTrainingForm = () => {
    if (advisorRef.current) {
      advisorRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to Advisor section smoothly
    }
  };
  
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
      <div className='corporate-training'>
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
    </>
  );
};

export default CorporateTraining;