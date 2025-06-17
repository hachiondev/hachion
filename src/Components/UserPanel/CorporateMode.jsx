import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';
import image2 from '../../Assets/la_chalkboard-teacher.png';
import image1 from '../../Assets/streamline_business-user-curriculum.png'
import image3 from '../../Assets/subway_world.png';
import image4 from '../../Assets/oui_documents.png';
import image5 from '../../Assets/fluent-mdl2_learning-tools.png';
import image6 from '../../Assets/hugeicons_peer-to-peer-02.png';
import image7 from '../../Assets/tabler_certificate.png';
import image8 from '../../Assets/oui_documents.png';



const CorporateMode = () => {
  const corporateDescription = "Corporate Training refers to a tailored learning approach designed specifically for organizations and businesses. This mode of training is customized to meet the unique needs and goals of company, focussing on equipping employees with the skills and knowledge necessary to excel in their roles and contribute to the organizations success";
  const corporateIdeal =[
    [
      { point: 'Corporate Employees, Team Members, New Hires,' },
      { point: 'Leadership Terms, Cross-Functional Teams' },
      { point: 'Skill Enhancement Candidates, Compliance Training Participants' },]
  ];
  
  const corporateFeatures = [
    [
      { content: 'Customized Curriculum' },
      { content: 'Expert Instructors' },
      { content: 'Real-World Scenarios' },
      { content: 'Hands-On Training' },
      { content: 'Peer Learning and Networking' }
     
    ],
    [ { content: 'Assesment and Feedback' },
        { content: 'Certification and Ongoing Support' },
        { content: 'Resource Materials and Post-Training Resources' }]
   
  ];

  return (
    <div>
      <LiveOnlineTraining 
        description={corporateDescription} 
        targetAudience={corporateIdeal} 
        features={corporateFeatures} 
      />
    </div>
  );
}

export default CorporateMode;
