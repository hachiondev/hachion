import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';

import image2 from '../../Assets/ci_folder-download.png';
import image3 from '../../Assets/oui_documents.png';
import image4 from '../../Assets/uil_file-download-alt.png';
import image5 from '../../Assets/mdi_support.png';
import image1 from '../../Assets/ri_video-download-line.png';
import image6 from '../../Assets/mdi_whatsapp.png';

const SelfPaced = () => {
  const selfDescription = "Complete control over your learning schedule. Access all training videos, materials, and projects anytime, anywhere. No live classes or mentor sessions—ideal for independent learners.";
  const selfIdeal =[
    [
      { point: 'Self-motivated learners ' },
      { point: 'Professionals with unpredictable schedules ' },
      { point: 'Cost-conscious learners seeking flexibility ' },
    ],
  ];
  
  const selfFeatures = [
    [
      { content: 'Full access to all training videos' },
      { content: 'Downloadable course documents and resources' },
      { content: 'Assignments and quizzes for practice' },
      { content: 'Lifetime access to LMS' },
      { content: 'Certification upon completion' },
      { content: 'Optional upgrade to mentor support if needed' },
    ],
  ];

  return (
    <div>
      <LiveOnlineTraining 
        description={selfDescription} 
        targetAudience={selfIdeal} 
        features={selfFeatures} 
      />
    </div>
  );
}

export default SelfPaced;
