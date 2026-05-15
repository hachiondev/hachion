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

const POPUP_DELAY = 30000;

const NewCourseDetails = () => {
  const { categoryName, courseName } = useParams();
  const navigate = useNavigate();
  const [helmetKey, setHelmetKey] = useState(0);
  const isLoggedIn = !!localStorage.getItem("loginuserData");

  const { data: allCourses = [], isLoading } =
    useAllCourses("courseDetailsPage");

  const courseData = allCourses.find(
  (c) =>
    slugify(c.courseName) === slugify(courseName) &&
    slugify(c.courseCategory) === slugify(categoryName)
);

const categorySlug = slugify(courseData?.courseCategory);

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
    const correctCourseSlug = slugify(courseData.courseName);
    const correctCategorySlug = slugify(courseData.courseCategory);

    if (
      courseName !== correctCourseSlug ||
      categoryName !== correctCategorySlug
    ) {
      navigate(
        `/courses/${correctCategorySlug}/${correctCourseSlug}`,
        { replace: true }
      );
    }
  }
}, [categoryName, courseName, courseData, isLoading, navigate]);

  {/* Always top on load */ }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [courseName]);

  /** ⏱️ TIME-BASED POPUP LOGIC */
  useEffect(() => {
    // ❌ Do NOT show popup if user is logged in
    if (
      // isLoggedIn
      //  ||
       hasShownPopup) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
      setHasShownPopup(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [isLoggedIn, hasShownPopup]);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     setShowPopup(false);
  //     setHasShownPopup(false);
  //   }
  // }, [courseName, isLoggedIn]);

  /** Lock body scroll */
 useEffect(() => {
  if (showPopup) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
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
    <>
      {courseData && (
        <Helmet>
          <title>{courseData.metaTitle}</title>

          <meta
            name="description"
            content={courseData.metaDescription}
          />

          <meta
            name="keywords"
            content={courseData.metaKeyword}
          />

          <meta property="og:title" content={courseData.metaTitle} />
          <meta
            property="og:description"
            content={courseData.metaDescription}
          />
          <meta
            property="og:image"
            content={courseData.metaImage}
          />
          <meta
            property="og:url"
            content={`https://hachion.co/courses/${categoryName}/${courseName}`}
          />

          <meta name="robots" content="index, follow" />
        </Helmet>
      )}

      <div className="blogs-header" style={{ marginLeft: "6vw" }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/courses">Courses</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link to="/courses" state={{ selectedCategory: courseData?.courseCategory }}>
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
    </>
  );
};

export default NewCourseDetails;
