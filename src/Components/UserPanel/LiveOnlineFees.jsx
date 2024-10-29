import React, { useState } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';

export const LiveOnlineFees = () => {
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
          {/* First batch */}
          <div className='partition'>
            <label className="radio-label">
              <input 
                type="radio" 
                name="batch" 
                value="batch1" 
                checked={selectedBatch === 'batch1'}
                onChange={() => handleBatchSelect('batch1')} 
                className="hidden-radio"
              />
              <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Aug 8 2024 <span className='date-span'>(Thursday)</span></p>
                <p className='batch-date'>09:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle className='demo-icon'/>Live Demo</p>
              </div>
            </label>
          </div>

          {/* Second batch */}
          <div className='partition'>
            <label className="radio-label">
              <input 
                type="radio" 
                name="batch" 
                value="batch2" 
                checked={selectedBatch === 'batch2'}
                onChange={() => handleBatchSelect('batch2')} 
                className="hidden-radio"
              />
              <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Sep 1 2024 <span className='date-span'>(Sunday)</span></p>
                <p className='batch-date'>07:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle className='demo-icon' />Live Demo</p>
              </div>
            </label>
          </div>

          {/* Third batch */}
          <div className='partition'>
            <label className="radio-label">
              <input 
                type="radio" 
                name="batch" 
                value="batch3" 
                checked={selectedBatch === 'batch3'}
                onChange={() => handleBatchSelect('batch3')} 
                className="hidden-radio"
              />
              <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Oct 5 2024 <span className='date-span'>(Saturday)</span></p>
                <p className='batch-date'>05:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle className='demo-icon'/>Live Demo</p>
              </div>
            </label>
          </div>
        </div>
        <div className='separator'></div>
        <LiveOnlineFeesRight fee="Free" enrollText="Enroll Now" />
      </div>
    </>
  );
};

export default LiveOnlineFees;