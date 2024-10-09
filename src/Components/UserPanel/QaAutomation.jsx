import React, { useEffect, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Course.css';
import Footer from './Footer';
import QaTop from './QaTop';
import KeyHighlights from './KeyHighlights';
import UpcomingHeader from './UpcomingHeader';
import UpcomingBatch from './UpcomingBatch';
import Corporate from './Corporate';
import Qacourse from './Qacourse';
import ModeOfTraining from './ModeOfTraining';
import CareerSupport from './CareerSupport';
import Learners from './Learners';
import StickyBar from './StickyBar';
import CurriculumMain from './CurriculumMain';
import QaAutomationFaq from './QaAutomationFaq';

const QaAutomation = () => {
  const curriculumRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleVideoButtonClick = () => {
    if (curriculumRef.current) {
      curriculumRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className='course-top'>
        <Topbar />
        <NavbarTop />
        <div className='course-banner'>
          <h3 className='course-banner-content'>QA Automation</h3>
        </div>
        <QaTop onVideoButtonClick={handleVideoButtonClick} />
        <KeyHighlights />

        <div id="upcoming-batch">
          <UpcomingHeader />
          <UpcomingBatch />
        </div>

        <div id="corporate">
          <Corporate />
        </div>
        <div id="qa-course">
          <Qacourse/>
        </div>

        <div id="curriculum" ref={curriculumRef}>
          <CurriculumMain />
        </div>

        <div id="mode-of-training">
          <ModeOfTraining />
        </div>

        <div id="career-support">
          <CareerSupport />
        </div>

        <div id="learners">
          <Learners />
        </div>

        <div id="qa-faq">
          <QaAutomationFaq />
        </div>

        <Footer />
        <StickyBar />
      </div>
    </>
  );
}

export default QaAutomation;