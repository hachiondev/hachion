// import React, { useState } from 'react';
// import LiveOnlineTrainingMain from './LiveOnlineTrainingMain';
// import CorporateMode from './CorporateMode';
// import MentoringMode from './MentoringMode';
// import SelfPlaced from './SelfPlaced';
// import './Course.css';
// import CrashCourse from './CrashCourse';

// const ModeOfTraining = () => {
//   const [selectedMode, setSelectedMode] = useState('LiveOnlineTraining'); // Default selected mode

//   const renderComponent = () => {
//     switch (selectedMode) {
//       case 'LiveOnlineTraining':
//         return <LiveOnlineTrainingMain />;
//       case 'CrashCourse':
//         return <CrashCourse />;
//       case 'MentoringMode':
//         return <MentoringMode />;
//       case 'SelfPlaced':
//         return <SelfPlaced />;
//       case 'CorporateMode':
//         return <CorporateMode />;
//       default:
//         return <LiveOnlineTrainingMain />;
//     }
//   };

//   return (
//     <div className='mode-of-training'>
//       <h2 className='qa-heading'>Mode of Training</h2>
//       <div className='batch-type'>
//         <p
//           className={`batch-type-content ${selectedMode === 'LiveOnlineTraining' ? 'active' : ''}`}
//           onClick={() => setSelectedMode('LiveOnlineTraining')}
//         >
//           Live Online Training
//         </p>
//         <p
//           className={`batch-type-content ${selectedMode === 'CrashCourse' ? 'active' : ''}`}
//           onClick={() => setSelectedMode('CrashCourse')}
//         >
//           Crash Course(Fast Track)
//         </p>
//         <p
//           className={`batch-type-content ${selectedMode === 'MentoringMode' ? 'active' : ''}`}
//           onClick={() => setSelectedMode('MentoringMode')}
//         >
//           Mentoring Mode
//         </p>
//         <p
//           className={`batch-type-content ${selectedMode === 'SelfPlaced' ? 'active' : ''}`}
//           onClick={() => setSelectedMode('SelfPlaced')}
//         >
//           Self-Paced Learning
//         </p>
//         <p
//           className={`batch-type-content ${selectedMode === 'CorporateMode' ? 'active' : ''}`}
//           onClick={() => setSelectedMode('CorporateMode')}
//         >
//           Corporate Training
//         </p>
//       </div>
//       <div className='mode-of-training-content'>
//         {renderComponent()}
//       </div>
//     </div>
//   );
// };

// export default ModeOfTraining;

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import './Course.css';
import 'swiper/css';
import 'swiper/css/navigation';

import LiveOnlineTrainingMain from './LiveOnlineTrainingMain';
// import CorporateMode from './CorporateMode';
// import MentoringMode from './MentoringMode';
import SelfPlaced from './SelfPlaced';
import CrashCourse from './CrashCourse';

const ModeOfTraining = () => {
  const modes = [
    { id: 1, title: 'Live Online Training', component: <LiveOnlineTrainingMain /> },
    { id: 2, title: 'Crash Course (Fast Track)', component: <CrashCourse /> },
    // { id: 3, title: 'Mentoring Mode', component: <MentoringMode /> },
    { id: 3, title: 'Self-Paced Learning', component: <SelfPlaced /> },
    // { id: 4, title: 'Corporate Training', component: <CorporateMode /> },
  ];

  return (
    <div className='mode-container'>
      <h2 className='qa-heading'>Mode of Training</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {modes.map((mode) => (
          <SwiperSlide key={mode.id}>
            <div className='card-mode'>
              <h3 className='card-title'>{mode.title}</h3>
              <div className='card-body'>{mode.component}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ModeOfTraining;
