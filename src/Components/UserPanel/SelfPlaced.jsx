import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';

import image2 from '../../Assets/ci_folder-download.png';
import image3 from '../../Assets/oui_documents.png';
import image4 from '../../Assets/uil_file-download-alt.png';
import image5 from '../../Assets/mdi_support.png';
import image1 from '../../Assets/ri_video-download-line.png';
import image6 from '../../Assets/mdi_whatsapp.png';

const SelfPlaced = () => {
  const anotherDescription = "Self-Placed Training is a flexible learning approach where students can access course matrials and complete assignments at their own place. This mode allows learners to study according to their own schedule,without the constraints of fixed class times or deadlines";
  const anotherTargetAudience ="Busy professionals, Independent Learners, Variable availability Learners, Self-Disciplined Learners, Review-Oriented Learners, Introverted Learners, Long-Term Learners";
  
  const anotherFeatures = [
    [
      { icon: image1, content: 'Downloadable recorder videos after every session' },
      { icon: image2, content: 'Downloadable interview questions and documents' },
      { icon: image3, content: 'Course materials and White papers(optional)' },
      { icon: image4, content: 'Downloadable sample resumes' },
      { icon: image5, content: 'Trainer support via email and whatsapp' },
    
    ],[  { icon: image6, content: 'Whatsapp group with 24*7 support team' }]
   
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

export default SelfPlaced;
