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
  const anotherDescription = "Mentor Mode Training refers to a personalized, guided learning approach where students receive one-on-one or small group instruction from a mentor. This method is highly effective for students who need tailored support, ongoing feedback and deeper engagement with the subject matter.";
  const anotherTargetAudience = "Career Transitioners, Struggling students, Advances Learners, Specialized Skill Seekers, Working Professionals, Project-Based Learners, Self-Placed Learners.";
  
  const anotherFeatures = [
    [
      { icon: image1, content: 'Downloadable recorder videos after every session' },
      { icon: image2, content: 'Downloadable interview questions and documents' },
      { icon: image3, content: 'Course materials and White papers(optional)' },
      { icon: image4, content: 'Downloadable sample resumes' },
      { icon: image5, content: 'Weekely doubt clarification sessions' },
     
    ],
    [ { icon: image6, content: 'Trainer support via email and Whatsapp' },
        { icon: image7, content: 'Whatsapp group with 24*7 support team' }]
   
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

export default MentoringMode;
