import React, { useEffect, useRef, useState } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
import { MdKeyboardArrowRight } from 'react-icons/md';

const QaAutomation = () => {
  const curriculumRef = useRef(null);
  const upcomingHeaderRef = useRef(null);
  const footerRef = useRef(null); // Footer reference for intersection observer
  const [isSticky, setIsSticky] = useState(false);
  // const { course_id } = useParams(); // Get course_id from URL
  const { courseName } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sticky logic
  useEffect(() => {
    const handleScroll = () => {
      if (upcomingHeaderRef.current) {
        const { top } = upcomingHeaderRef.current.getBoundingClientRect();
        setIsSticky(top <= 0); // Set sticky if the header's top reaches 0 or less
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer to detect when footer is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSticky(false); // Unstick the header when the footer comes into view
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

  const handleVideoButtonClick = () => {
    if (curriculumRef.current) {
      curriculumRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/courses/all');
        const course = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCourseData(course);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }finally {
              setLoading(false);
    }
  }

    fetchCourseData();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className='course-top'>
        <Topbar />
        <NavbarTop />
        <div className='course-banner'>
          <h3 className='course-banner-content'>{courseData?.courseName}</h3>
        </div>
        <div className='blogs-header'>
          <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
          <li className="breadcrumb-item">
                <a href="/courses">Courses</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item">
                <a href={`/courses/${courseData?.courseCategory}`}>
                  {courseData?.courseCategory}
                </a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {courseData?.courseName}
              </li>
          </ol>
        </nav>
        </div>
        <QaTop onVideoButtonClick={handleVideoButtonClick} />
        <KeyHighlights />

        {/* Sticky Header applies to the entire section below */}
        <div ref={upcomingHeaderRef}>
          <div className={isSticky ? 'sticky upcoming-header' : 'upcoming-header'}>
            <UpcomingHeader />
        
        </div>

        <div id="upcoming-batch">
          <UpcomingBatch />
        </div>

        <div id="corporate">
          <Corporate />
        </div>

        <div id="qa-course">
          <Qacourse />
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

export default QaAutomation;