import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';
import image1 from '../../Assets/la_chalkboard-teacher.png';
import image2 from '../../Assets/heroicons_rocket-launch.png';
import image3 from '../../Assets/ci_folder-download.png';
import image4 from '../../Assets/oui_documents.png';
import image5 from '../../Assets/uil_file-download-alt.png';
import image6 from '../../Assets/carbon_group-presentation.png';
import image7 from '../../Assets/ic_outline-contact-support.png';
import image8 from '../../Assets/mdi_support.png';
import image9 from '../../Assets/ri_video-download-line.png';
import image10 from '../../Assets/mdi_whatsapp.png';

const LiveOnlineTrainingMain = () => {
  const description = "LIVE Mode Training refers to real time, interactive training sessions where students participate in live classes led by an instructor. This method allows for immediate feedback, active participation, and dynamic interaction with both the trainer and peers, creating an engaging learning experience.";

  const targetAudience = "Interactive Learners, Immediate Feedback Seekers, Structured Learners, Collaborative Learners, Beginner Level Students, Motivational Learners, Time Bound Learners.";

  const features = [
    [
      { icon: image1, content: 'Live interactive training sessions' },
      { icon: image2, content: 'Daily Assignments and Lab exercises' },
      { icon: image3, content: 'Downloadable interview questions and documents' },
      { icon: image4, content: 'Course materials and white papers (optional)' },
      { icon: image5, content: 'Downloadable sample resumes' }
    ],
    [
      { icon: image6, content: 'Special attention for students from non-IT backgrounds' },
      { icon: image7, content: 'Separate sessions for doubt clarification' },
      { icon: image8, content: 'Trainer support via email and Whatsapp' },
      { icon: image9, content: 'Downloadable recorded videos after every session' },
      { icon: image10, content: 'Whatsapp group with 24/7 support team' }
    ]
  ];

  return (
    <div>
      <LiveOnlineTraining 
        description={description} 
        targetAudience={targetAudience} 
        features={features} 
      />
    </div>
  );
}

export default LiveOnlineTrainingMain;
