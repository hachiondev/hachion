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
  const anotherDescription = "Corporate Training refers to a tailored learning approach designed specifically for organizations and businesses. This mode of training is customized to meet the unique needs and goals of company, focussing on equipping employees with the skills and knowledge necessary to excel in their roles and contribute to the organizations success";
  const anotherTargetAudience ="Corporate Employees, Team Members, New Hires, Leadership Terms, Cross-Functional Teams, Skill Enhancement Candidates, Compliance Training Participants";
  
  const anotherFeatures = [
    [
      { icon: image1, content: 'Customized Curriculum' },
      { icon: image2, content: 'Expert Instructors' },
      { icon: image3, content: 'Real-World Scenarios' },
      { icon: image4, content: 'Hands-On Training' },
      { icon: image5, content: 'Peer Learning and Networking' }
     
    ],
    [ { icon: image6, content: 'Assesment and Feedback' },
        { icon: image7, content: 'Certification and Ongoing Support' },
        { icon: image8, content: 'Resource Materials and Post-Training Resources' }]
   
  ];

  return (
    <div>
      <LiveOnlineTraining 
        description={anotherDescription} 
        targetAudience={anotherTargetAudience} 
        features={anotherFeatures} 
      />
    </div>
  );
}

export default CorporateMode;
