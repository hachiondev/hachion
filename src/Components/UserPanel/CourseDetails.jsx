import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Course.css';
import CourseDetailsTop from './CourseDetailsTop';
import KeyHighlights from './KeyHighlights';
import UpcomingHeader from './UpcomingHeader';
import UpcomingBatch from './UpcomingBatch';
import Corporate from './HomePage/CorporateSection/Corporate';
import CoursesAll from './CoursesAll';
import ModeOfTraining from './ModeOfTraining';
import CareerSupport from './CareerSupport';
import CourseCertificate from './CourseCertificate';
import Learners from "./HomePage/LearnerSection/Learners";
import TrainerProfile from './TrainerProfile';
import CurriculumMain from './CurriculumMain';
import CourseDetailsFaq from './CourseDetailsFaq';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import Loader from './Loader/Loader';
import { useAllCourses } from '../../Api/hooks/SitemapPageApi/useAllCourses';
const CourseDetails = () => {
  const curriculumRef = useRef(null);
  const location = useLocation();
  const [helmetKey, setHelmetKey] = useState(0);
  const upcomingHeaderRef = useRef(null);
  const footerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const { courseName } = useParams();
  const upcomingBatchRef = useRef(null);
  const { data: allCourses  = [], isLoading , isError} = useAllCourses("courseDetailsPage");

  useEffect(() => {
    if (location.hash === '#upcoming-events') {
      const element = document.getElementById('upcoming-events');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const courseData = allCourses.find(
  (c) => c.courseName.toLowerCase().replace(/\s+/g, "-") === courseName
);

useEffect(() => {
  setHelmetKey((prev) => prev + 1);
}, [courseData]);

  useEffect(() => {
    console.log("Privacy component mounted. Scrolling to top...");
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    console.log("Scroll to top clicked!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    if (!isLoading && location?.state?.scrollTo === 'upcoming-batch') {
      upcomingBatchRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Clear state to avoid repeating
      window.history.replaceState({}, document.title);
    }
  }, [isLoading, location]);


  // useEffect(() => {
  //   const fetchCourseData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get('https://api.test.hachion.co/courses/all');
  //       const course = response.data.find(
  //         (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
  //       );
  //       setCourseData(course);
  //       setHelmetKey((prevKey) => prevKey + 1); // Force re-render
  //     } catch (error) {
  //       console.error('Error fetching course details:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCourseData();
  // }, [courseName]);

  if (isError) return <div>Error: {isError}</div>;
  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Helmet key={helmetKey}>
        <title>{courseData?.metaTitle || "Hachion Courses"}</title>
        <meta name="description" content={courseData?.metaDescription || "Default description"} />
        <meta name="keywords" content={courseData?.metaKeyword || "default, keywords"} />
        <meta property="og:title" content={courseData?.metaTitle || "Best Online IT Certification Courses"} />
        <meta property="og:description" content={courseData?.metaDescription || "Transform your career with Hachion's Online IT Courses."} />
        <meta property="og:image" content={courseData?.metaImage || "https://hachion.co/images/course-banner.jpg"} />
        <meta property="og:url" content={`https://hachion.co/coursedetails/${courseName}`} />
        <meta name="robots" content="index, follow" />
      </Helmet>


      <div className='course-top'>
        {/* <div className='course-banner'>
          <h3 className='course-banner-content'>{courseData?.courseName}</h3>
        </div> */}
        <div className='blogs-header'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/coursedetails">Courses</Link> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item">
                <Link to="/coursedetails">
                  {courseData?.courseCategory}
                </Link> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {courseData?.courseName}
              </li>
            </ol>
          </nav>
        </div>
        {/* <h3 className='top-course-name' >{courseData?.courseName}</h3> */}
        <CourseDetailsTop
          onVideoButtonClick={handleVideoButtonClick}
          onEnrollButtonClick={() =>
            upcomingBatchRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        />
        <KeyHighlights />

        {/* Sticky Header applies to the entire section below */}
        <div ref={upcomingHeaderRef}>
          <div className={isSticky ? 'sticky upcoming-header' : 'upcoming-header'}>
            <UpcomingHeader />

          </div>

          <div id="upcoming-batch" ref={upcomingBatchRef}>
            <UpcomingBatch />
          </div>

          <div id="mode-of-training">
            <ModeOfTraining />
          </div>

          <div id="corporate">
            <Corporate />
          </div>

          <div id="qa-course">
            <CoursesAll />
          </div>

          <div id="curriculum" ref={curriculumRef}>
            <CurriculumMain />
          </div>

          <div id="career-support">
            <CareerSupport />
          </div>

          <div id="course-certificate">
            <CourseCertificate />
          </div>

          <div id="learners">
            <Learners page="course" />

          </div>

          <div id="qa-faq">
            <CourseDetailsFaq />
          </div>

          <div id="trainer-profile">
            <TrainerProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;