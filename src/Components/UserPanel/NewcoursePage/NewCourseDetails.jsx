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

const NewCourseDetails = () => {
    const demoClassRef = useRef(null);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}, []);

  const scrollToDemoClass = () => {
    demoClassRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div>
      <CourseBanner
       onEnroll={scrollToDemoClass}
        onAddToCart={() => console.log("Add to cart")}
      />
      <LearnSection />
      <DemoClassSection ref={demoClassRef}/>
      <CourseCurriculum />
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
