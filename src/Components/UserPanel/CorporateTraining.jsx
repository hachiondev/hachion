import React, { useRef } from 'react';
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

const CorporateTraining = () => {
  const advisorRef = useRef(null); // Create a ref for Advisor

  const scrollToAdvisor = () => {
    if (advisorRef.current) {
      advisorRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to Advisor section smoothly
    }
  };

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
      <StickyBar />
    </>
  );
};

export default CorporateTraining;
