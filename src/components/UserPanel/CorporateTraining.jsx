import CorporateBanner from './CorporateBanner';
import Association from './Association';
import CustomizeTraining from './CustomizeTraining';
import LeadingExpert from './LeadingExpert';
import CorporateTrainingFeature from './CorporateTrainingFeature';
import Learners from "./HomePage/LearnerSection/Learners";
import HomeFaq from './HomeFaq';
import CorporateContactUs from './CorporatePage/CorporateContactUs';

// Server Component. The CRA original's advisorRef/scrollToCorporateTrainingForm
// flow and its useLocation()-driven auto-scroll were dead code end-to-end —
// the scroll target (<div ref={advisorRef}><CorporateTrainingForm /></div>)
// was itself commented out, so nothing ever consumed that ref. Dropped
// entirely; CorporateBanner's own "Get Free Consultation" button already
// opens CorporateTrainingForm as a real, live popup independent of that
// dead flow.
const CorporateTraining = () => {
  return (
    <div className='corporate-training'>
      <CorporateBanner />
      <Association />
      <CorporateTrainingFeature />
      <LeadingExpert />
      <CustomizeTraining />
      <Learners page="corporate" />
      <CorporateContactUs />
      <HomeFaq />
    </div>
  );
};

export default CorporateTraining;
