import CourseBanner from '../../NewCourse/CourseBanner';
import CareerOutcomes from '../../NewCourse/CareerOutcomes';
import CertificateSection from '../../NewCourse/CertificateSection';
import CourseCurriculum from '../../NewCourse/CourseCurriculum';
import DemoClassSection from '../../NewCourse/DemoClassSection';
import FAQSection from '../../NewCourse/FAQSection';
import FinalCTA from '../../NewCourse/FinalCTA';
import InstructorSection from '../../NewCourse/InstructorSection';
import LearnSection from '../../NewCourse/LearnSection';
import StudentsAlsoEnrolled from '../../NewCourse/StudentsAlsoEnrolled';
import StudentsSay from '../../NewCourse/StudentsSay';
import SuccessStories from '../../NewCourse/SuccessStories';
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
      <CourseCurriculum onViewDemoClass={scrollToDemoClass}/>
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
