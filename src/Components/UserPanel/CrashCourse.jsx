import React from 'react';
import LiveOnlineTraining from './LiveOnlineTraining';

const CrashCourse = () => {
  const CrashDescription = "Designed for learners on a tight schedule, this accelerated training delivers essential concepts quickly and efficiently. Get intensive training with focused sessions that prepare you for your career goals faster. ";
  const CrashIdeal =[
    [
      { point: 'Working professionals looking to upskill quickly' },
      { point: 'Job seekers with immediate placement goals' },
      { point: 'Learners with prior exposure needing a refresher' },
    ],
  ];
  
  const CrashFeatures = [
    [
      { content: 'Condensed training schedule ' },
      { content: 'Fast-paced, exam- or job-oriented instruction' },
      { content: 'Access to recorded sessions' },
      { content: 'Quick-start projects and hands-on tasks' },
      { content: 'Interview readiness sessions included' },
      { content: 'Email & WhatsApp trainer access' },
    ],
  ];

  return (
    <div>
      <LiveOnlineTraining 
        description={CrashDescription} 
        targetAudience={CrashIdeal} 
        features={CrashFeatures} 
      />
    </div>
  );
}

export default CrashCourse;
