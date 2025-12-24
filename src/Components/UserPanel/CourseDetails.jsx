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
// import Loader from './Loader/Loader';
import { useAllCourses } from '../../Api/hooks/SitemapPageApi/useAllCourses';
const CourseDetails = () => {
  const curriculumRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [helmetKey, setHelmetKey] = useState(0);
  const upcomingHeaderRef = useRef(null);
  const footerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const { courseName } = useParams();
  const upcomingBatchRef = useRef(null);
  const {
    data: allCourses = [],
    isLoading,
    isError,
  } = useAllCourses("courseDetailsPage");
  const slugify = (text = "") =>
  text.toLowerCase().trim().replace(/\s+/g, "-");

  /* ---------------- FIND COURSE ---------------- */
  const courseData = allCourses.find(
    (c) => slugify(c.courseName) === courseName
  );

  /* ---------------- SCROLL TO TOP ON COURSE CHANGE ---------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [courseName]);

  /* ---------------- HELMET FORCE UPDATE ---------------- */
  useEffect(() => {
    if (courseData) {
      setHelmetKey((prev) => prev + 1);
    }
  }, [courseData]);

  /* ---------------- HASH SCROLL (SAFE) ---------------- */
  useEffect(() => {
    if (!isLoading && location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash, isLoading]);

  /* ---------------- STATE SCROLL (SAFE) ---------------- */
  // useEffect(() => {
  //   if (!isLoading && location.state?.scrollTo === "upcoming-batch") {
  //     upcomingBatchRef.current?.scrollIntoView({ behavior: "smooth" });
  //     navigate(location.pathname, { replace: true });
  //   }
  // }, [isLoading, location.state, navigate, location.pathname]);

  // /* ---------------- STICKY HEADER ---------------- */
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (upcomingHeaderRef.current) {
  //       const { top } = upcomingHeaderRef.current.getBoundingClientRect();
  //       setIsSticky(top <= 0);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  /* ---------------- FOOTER INTERSECTION ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsSticky(false),
      { threshold: 0.1 }
    );

    footerRef.current && observer.observe(footerRef.current);
    return () => footerRef.current && observer.unobserve(footerRef.current);
  }, []);

  /* ---------------- VIDEO SCROLL ---------------- */
  const handleVideoButtonClick = () => {
    curriculumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- LOAD STATES ---------------- */
  if (isError) return <div>Something went wrong.</div>;
  // if (isLoading || !courseData) return <Loader />;

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