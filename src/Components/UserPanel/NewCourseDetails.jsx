import CourseBanner from '../NewCourse/CourseBanner';
import CareerOutcomes from '../NewCourse/CareerOutcomes';
import CertificateSection from '../NewCourse/CertificateSection';
import CourseCurriculum from '../NewCourse/CourseCurriculum';
import DemoClassSection from '../NewCourse/DemoClassSection';
import FAQSection from '../NewCourse/FAQSection';
import FinalCTA from '../NewCourse/FinalCTA';
import InstructorSection from '../NewCourse/InstructorSection';
import LearnSection from '../NewCourse/LearnSection';
import StudentsAlsoEnrolled from '../NewCourse/StudentsAlsoEnrolled';
import StudentsSay from '../NewCourse/StudentsSay';
import SuccessStories from '../NewCourse/SuccessStories';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';

const NewCourseDetails = () => {
  return (
    <div className="page">
      <Topbar />
        <NavbarTop />
      <CourseBanner
        onEnroll={() => console.log("Enroll clicked")}
        onAddToCart={() => console.log("Add to cart")}
      />
      <LearnSection />
      <DemoClassSection />
      <CourseCurriculum />
      <InstructorSection />
      <CareerOutcomes />
      <CertificateSection />
      <SuccessStories />
      <StudentsSay onCta={() => console.log("Start your journey")} />
      <StudentsAlsoEnrolled />
      <FAQSection
        onChat={() => console.log("Open chat widget")}
        onSchedule={() => console.log("Open scheduler")}
      />
      <FinalCTA
        onEnroll={() => console.log("Enroll clicked")}
        onAddToCart={() => console.log("Add to cart")}
      />
          <Footer />
    </div>
  );
};

export default NewCourseDetails;
