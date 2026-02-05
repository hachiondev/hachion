import React from 'react';
import CourseBanner from '../NewcoursePage/components/CourseBanner';
import CareerOutcomes from '../NewcoursePage/components/CareerOutcomes';
import CertificateSection from '../NewcoursePage/components/CertificateSection';
import CourseCurriculum from '../NewcoursePage/components/CourseCurriculum';
import DemoClassSection from '../NewcoursePage/components/DemoClassSection';
import FAQSection from '../NewcoursePage/components/FAQSection';
import FinalCTA from '../NewcoursePage/components/FinalCTA';
import InstructorSection from '../NewcoursePage/components/InstructorSection';
import LearnSection from '../NewcoursePage/components/LearnSection';
import StudentsAlsoEnrolled from '../NewcoursePage/components/StudentsAlsoEnrolled';
import StudentsSay from '../NewcoursePage/components/StudentsSay';
import SuccessStories from '../NewcoursePage/components/SuccessStories';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAllCourses } from '../../../Api/hooks/SitemapPageApi/useAllCourses';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Helmet } from 'react-helmet-async';
import EnrollmentPopup from './Enrollmentpopup';

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

const POPUP_DELAY = 5000; // ⏱️ 30 seconds

const NewCourseDetails = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [helmetKey, setHelmetKey] = useState(0);

  const { data: allCourses = [], isLoading } =
    useAllCourses("courseDetailsPage");

  const courseData = allCourses.find(
    (c) => slugify(c.courseName) === slugify(courseName)
  );

  /* ---------------- HELMET FORCE UPDATE ---------------- */
  useEffect(() => {
    if (courseData) {
      setHelmetKey((prev) => prev + 1);
    }
  }, [courseData]);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Section refs for tracking scroll
  const sectionRefs = useRef([]);
  const demoClassRef = useRef(null);

  useEffect(() => {
    if (!isLoading && courseData) {
      const correctSlug = slugify(courseData.courseName);
      if (courseName !== correctSlug) {
        navigate(`/coursedetails/${correctSlug}`, { replace: true });
      }
    }
  }, [courseName, courseData, isLoading, navigate]);

  {/* Always top on load */ }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [courseName]);

  /** ⏱️ TIME-BASED POPUP LOGIC */
  useEffect(() => {
    if (hasShownPopup) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
      setHasShownPopup(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [hasShownPopup]);

  useEffect(() => {
    // Reset popup when course changes
    setShowPopup(false);
    setHasShownPopup(false);
  }, [courseName]);

  /** Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showPopup]);

  const scrollToDemoClass = () => {
    demoClassRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Helper to add section refs
  const addSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div>
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
      <div className="blogs-header" style={{ marginLeft: "6vw" }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/coursedetails">Courses</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link to="/coursedetails" state={{ selectedCategory: courseData?.courseCategory }}>
                {courseData?.courseCategory}
              </Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {courseData?.courseName}
            </li>
          </ol>
        </nav>
      </div>

      {/* Sections with refs for scroll tracking */}
      <div ref={addSectionRef(0)}>
        <CourseBanner
          onEnroll={scrollToDemoClass}
          onAddToCart={() => console.log("Add to cart")}
        />
      </div>


      <LearnSection />

      <div ref={demoClassRef}>
        <DemoClassSection ref={demoClassRef} onViewDemoClass={scrollToDemoClass} />
      </div>


      <CourseCurriculum onViewDemoClass={scrollToDemoClass} />

      <InstructorSection />


      {/* <CareerOutcomes /> */}
      <CertificateSection />
      {/* <SuccessStories /> */}

      <StudentsSay />

      <StudentsAlsoEnrolled />
      <FAQSection
        onChat={() => console.log("Open chat widget")}
        onSchedule={() => console.log("Open scheduler")}
      />

      {/* <FinalCTA
        onEnroll={() => console.log("Enroll clicked")}
        onAddToCart={() => console.log("Add to cart")}
      /> */}

      {/* Enrollment Popup */}
      <EnrollmentPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default NewCourseDetails;
