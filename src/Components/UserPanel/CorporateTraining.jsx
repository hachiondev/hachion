// 👉 All imports are at the top (Clean + Ordered)
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

// 👉 Components
import CorporateBanner from './CorporateBanner';
import Association from './Association';
import Hachion from './Hachion';
import CustomizeTraining from './CustomizeTraining';
import LeadingExpert from './LeadingExpert';
import CorporateTrainingFeature from './CorporateTrainingFeature';
import Learners from "./HomePage/LearnerSection/Learners";
import HomeFaq from './HomeFaq';
import CorporateContactUs from './CorporatePage/CorporateContactUs';

// ===============================
//   COMPONENT STARTS
// ===============================
const CorporateTraining = () => {

  const advisorRef = useRef(null);

  // Scroll to Corporate Training Form
  const scrollToCorporateTrainingForm = () => {
    if (advisorRef.current) {
      advisorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    console.log("Scroll to top clicked!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const location = useLocation();

  // Trigger scroll when user arrives from another page
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
        <CorporateBanner onContactUsClick={scrollToCorporateTrainingForm} />
        <Association />
        <CorporateTrainingFeature />
        {/* <Hachion /> */}
        <LeadingExpert />
        <CustomizeTraining />
        <Learners page="home" />
        <CorporateContactUs />
        <HomeFaq />
        {/* <div ref={advisorRef}>
          <CorporateTrainingForm />
        </div> */}
      </div>
    </>
  );
};

export default CorporateTraining;
