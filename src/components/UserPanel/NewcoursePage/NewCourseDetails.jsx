"use client";

import React, { lazy, Suspense } from "react";
import CourseBanner from "./components/CourseBanner";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCourses } from "@/Api/hooks/HomePageApi/NavbarApi/useCourses";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { slugifyCourseText as slugify } from "../CoursePage/courseRouteUtils";

// Below-the-fold sections — code-split so they don't add to the initial
// bundle every course page ships. CourseBanner (the hero) stays eager.
const CertificateSection = lazy(() => import("./components/CertificateSection"));
const CourseCurriculum = lazy(() => import("./components/CourseCurriculum"));
const DemoClassSection = lazy(() => import("./components/DemoClassSection"));
const FAQSection = lazy(() => import("./components/FAQSection"));
const InstructorSection = lazy(() => import("./components/InstructorSection"));
const LearnSection = lazy(() => import("./components/LearnSection"));
const StudentsAlsoEnrolled = lazy(() => import("./components/StudentsAlsoEnrolled"));
const StudentsSay = lazy(() => import("./components/StudentsSay"));
const EnrollmentPopup = lazy(() => import("./Enrollmentpopup"));
// "Upcoming Trainings at Hachion" — the same TrainingEvents component the
// homepage uses (default props: header + filters + 4 cards + View More),
// matching what's live on hachion.co's course-details pages.
const TrainingEvents = lazy(() => import("@/components/UserPanel/HomePage/TrainingSection/TrainingEvents"));

const POPUP_DELAY = 30000;

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/NewCourseDetails.jsx — the course
// details page at /courses/:categoryName/:courseName.
// useNavigate/useParams (react-router-dom) -> useRouter/useParams
// (next/navigation). <Helmet>/<Canonical> and all JSON-LD <script> blocks
// moved to app/(public)/courses/[categoryName]/[courseName]/page.js's
// generateMetadata()/JsonLd (this Next.js app's established convention —
// see the Courses listing page migration). Unlike the CRA original, that
// metadata is now server-rendered from a dedicated fetch rather than only
// appearing after client-side hydration.
const NewCourseDetails = ({ categoryName: categoryNameProp, categoryDisplay, courseDisplay, initialCourse, initialFaqs, initialCurriculum } = {}) => {
  // Next.js's useParams() (unlike react-router's) does not auto-decode
  // percent-escapes in dynamic segments — a slug like "c%2B%2B" arrives
  // as-is rather than "c++", so it must be decoded before slug-matching or
  // the lookup below silently never matches.
  const rawParams = useParams();
  const categoryName = decodeURIComponent(rawParams.categoryName || "");
  const courseName = decodeURIComponent(rawParams.courseName || "");
  const router = useRouter();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("loginuserData");
  // Only courseName/courseCategory are needed here, so the ~16 KB names list
  // (shared cache with the navbar/enrollment form) instead of /courses/all,
  // which ships every course's full record (>1 MB) to each course page.
  const { data: allCourses = [], isLoading } = useCourses();
  const courseData = allCourses.find((c) => slugify(c.courseName) === slugify(courseName) && slugify(c.courseCategory) === slugify(categoryName));

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  const demoClassRef = useRef(null);
  useEffect(() => {
    if (!isLoading && courseData) {
      const correctCourseSlug = slugify(courseData.courseName);
      const correctCategorySlug = slugify(courseData.courseCategory);
      if (courseName !== correctCourseSlug || categoryName !== correctCategorySlug) {
        router.replace(`/courses/${correctCategorySlug}/${correctCourseSlug}`);
      }
    }
  }, [categoryName, courseName, courseData, isLoading, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [courseName]);

  useEffect(() => {
    if (hasShownPopup) return;
    const timer = setTimeout(() => {
      setShowPopup(true);
      setHasShownPopup(true);
    }, POPUP_DELAY);
    return () => clearTimeout(timer);
  }, [isLoggedIn, hasShownPopup]);

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
    demoClassRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <>
      <div className="blogs-header" style={{ marginLeft: "11.5vw" }}>
        <nav aria-label="breadcrumb" style={{ display: "flex", alignItems: "center" }}>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link href="/courses">Courses</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link href={`/courses/${courseData ? slugify(courseData.courseCategory) : categoryNameProp || categoryName}`}>
                {courseData?.courseCategory || categoryDisplay}
              </Link>{" "}
              <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {courseData?.courseName || courseDisplay}
            </li>
          </ol>
        </nav>
      </div>

      <div>
        <CourseBanner onEnroll={scrollToDemoClass} initialCourse={initialCourse} initialCurriculum={initialCurriculum} />
      </div>
      {/* One Suspense wrapping every below-the-fold section (matching
          Home.jsx's fix) forces React to wait for the slowest of the lazy
          chunks, then mount all of them in one synchronous burst rather
          than each committing independently as its own chunk loads. */}
      <Suspense fallback={null}>
        <LearnSection />
      </Suspense>
      <div ref={demoClassRef}>
        <Suspense fallback={null}>
          <DemoClassSection ref={demoClassRef} onViewDemoClass={scrollToDemoClass} />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <CourseCurriculum onViewDemoClass={scrollToDemoClass} initialCourse={initialCourse} initialCurriculum={initialCurriculum} />
      </Suspense>
      <Suspense fallback={null}>
        <InstructorSection />
      </Suspense>
      <Suspense fallback={null}>
        <CertificateSection courseName={courseData?.courseName} />
      </Suspense>
      <Suspense fallback={null}>
        <StudentsSay />
      </Suspense>
      <Suspense fallback={null}>
        <StudentsAlsoEnrolled />
      </Suspense>
      <Suspense fallback={null}>
        <TrainingEvents />
      </Suspense>
      <Suspense fallback={null}>
        <FAQSection initialCourse={initialCourse} initialFaqs={initialFaqs} />
      </Suspense>

      <Suspense fallback={null}>
        <EnrollmentPopup isOpen={showPopup} onClose={handleClosePopup} />
      </Suspense>
    </>
  );
};
export default NewCourseDetails;
