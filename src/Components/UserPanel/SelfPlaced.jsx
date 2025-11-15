import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';

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
