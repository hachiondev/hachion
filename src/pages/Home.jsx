import Banner from '../components/Banner';
import CareerOutcomes from '../components/CareerOutcomes';
import CertificateSection from '../components/CertificateSection';
import CourseCurriculum from '../components/CourseCurriculum';
import DemoClassSection from '../components/DemoClassSection';
import FAQSection from '../components/FAQSection';
import FinalCTA from '../components/FinalCTA';
import InstructorSection from '../components/InstructorSection';
import LearnSection from '../components/LearnSection';
import StudentsAlsoEnrolled from '../components/StudentsAlsoEnrolled';
import StudentsSay from '../components/StudentsSay';
import SuccessStories from '../components/SuccessStories';

const Home = () => {
  return (
    <div className="page">
      <Banner
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

    </div>
  );
};

export default Home;
