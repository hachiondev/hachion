import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';

const LiveOnlineTrainingMain = () => {
  const description = "Join real-time instructor-led sessions from anywhere. This mode includes interactive classes, hands-on exercises, and live Q&A to ensure in-depth learning. Sessions are scheduled regularly, with recordings available after each class.";

  const targetAudience = [
    [
      { point: 'Learners who thrive in a structured environment ' },
      { point: 'Professionals seeking live interaction with trainers' },
      { point: 'Individuals needing accountability to stay on track ' },
    ]
  ];

  const features = [
    [
      { content: 'Live interactive sessions with industry experts ' },
      { content: 'Access to class recordings' },
      { content: 'Real-time Q&A and concept clarification' },
      { content: 'Regular assignments and assessments' },
      { content: 'Post-class downloadable materials ' },
      { content: 'Dedicated trainer and WhatsApp group support' },
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