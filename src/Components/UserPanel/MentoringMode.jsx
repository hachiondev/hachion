import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';
import image2 from '../../Assets/ci_folder-download.png';
import image3 from '../../Assets/oui_documents.png';
import image4 from '../../Assets/uil_file-download-alt.png';
import image5 from '../../Assets/ic_outline-contact-support.png';
import image6 from '../../Assets/mdi_support.png';
import image1 from '../../Assets/ri_video-download-line.png';
import image7 from '../../Assets/mdi_whatsapp.png';

const MentoringMode = () => {
  const mentorDescription = "Mentor Mode Training refers to a personalized, guided learning approach where students receive one-on-one or small group instruction from a mentor. This method is highly effective for students who need tailored support, ongoing feedback and deeper engagement with the subject matter.";
  const mentorIdeal = [
    [
      { point: 'Career changers and professionals with tight schedules' },
      { point: 'Learners needing customized feedback and flexible timing ' },
      { point: 'Self-paced learners who still want live guidance' },
    ],
  ];
  
  const mentorFeatures = [
    [
      { content: 'Downloadable recorded videos' },
      { content: 'Weekly mentor Q&A/doubt clarification sessions' },
      { content: 'Downloadable interview prep materials' },
      { content: 'Course materials & optional white papers' },
      { content: 'Role-specific sample resumes' },
      { content: 'Trainer support via email and WhatsApp' },
      { content: '24/7 support group access' },
    ],
  ];

  return (
    <div>
      <LiveOnlineTraining 
        description={mentorDescription} 
        targetAudience={mentorIdeal} 
        features={mentorFeatures} 
      />
    </div>
  );
}

export default MentoringMode;