import React, { useState } from 'react';
import LiveOnlineTrainingMain from './LiveOnlineTrainingMain';
import CorporateMode from './CorporateMode';
import MentoringMode from './MentoringMode';
import SelfPlaced from './SelfPlaced';
import './Course.css';

const ModeOfTraining = () => {
  const [selectedMode, setSelectedMode] = useState('LiveOnlineTraining'); // Default selected mode

  const renderComponent = () => {
    switch (selectedMode) {
      case 'LiveOnlineTraining':
        return <LiveOnlineTrainingMain />;
      case 'CorporateMode':
        return <CorporateMode />;
      case 'MentoringMode':
        return <MentoringMode />;
      case 'SelfPlaced':
        return <SelfPlaced />;
      default:
        return <LiveOnlineTrainingMain />;
    }
  };

  return (
    <div className='mode-of-training'>
      <h1 className='qa-heading'>Mode of Training</h1>
      <div className='batch-type'>
        <p
          className={`batch-type-content ${selectedMode === 'LiveOnlineTraining' ? 'active' : ''}`}
          onClick={() => setSelectedMode('LiveOnlineTraining')}
        >
          Live Online Training
        </p>
        <p
          className={`batch-type-content ${selectedMode === 'CorporateMode' ? 'active' : ''}`}
          onClick={() => setSelectedMode('CorporateMode')}
        >
          Corporate Training
        </p>
        <p
          className={`batch-type-content ${selectedMode === 'MentoringMode' ? 'active' : ''}`}
          onClick={() => setSelectedMode('MentoringMode')}
        >
          Mentoring Mode
        </p>
        <p
          className={`batch-type-content ${selectedMode === 'SelfPlaced' ? 'active' : ''}`}
          onClick={() => setSelectedMode('SelfPlaced')}
        >
          Self-Placed Learning
        </p>
      </div>
      <div className='mode-of-training-content'>
        {renderComponent()}
      </div>
    </div>
  );
};

export default ModeOfTraining;
