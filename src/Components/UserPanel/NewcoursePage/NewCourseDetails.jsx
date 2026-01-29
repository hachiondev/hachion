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
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAllCourses } from '../../../Api/hooks/SitemapPageApi/useAllCourses';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';


const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

const NewCourseDetails = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();

  const { data: allCourses = [], isLoading } =
    useAllCourses("courseDetailsPage");

  const courseData = allCourses.find(
    (c) => slugify(c.courseName) === slugify(courseName)
  );

  useEffect(() => {
    if (!isLoading && courseData) {
      const correctSlug = slugify(courseData.courseName);
      if (courseName !== correctSlug) {
        navigate(`/coursedetails/${correctSlug}`, { replace: true });
      }
    }
  }, [courseName, courseData, isLoading, navigate]);

  const demoClassRef = useRef(null);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [courseName]);

  const scrollToDemoClass = () => {
    demoClassRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div>
      <div className="blogs-header" style={{ marginLeft: "6vw" }}>
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
      <CourseBanner
        onEnroll={scrollToDemoClass}
        onAddToCart={() => console.log("Add to cart")}
      />
      <LearnSection />
      <DemoClassSection ref={demoClassRef} onViewDemoClass={scrollToDemoClass} />
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

    </div>
  );
};

export default NewCourseDetails;
