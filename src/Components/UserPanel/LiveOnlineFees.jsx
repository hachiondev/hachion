import React from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';

export const LiveOnlineFees = () => {
  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
          {/* First batch */}
          <div className='partition'>
          <label>
  <input type="radio" name="radio" />
  <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Aug 8 2024 <span className='date-span'>(Thursday)</span></p>
                <p className='batch-date'>09:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle style={{ marginRight:'1vh', height:'20px', width:'20px' }}/>Live Demo</p>
              </div>
            </label>
          </div>

          <div className='separator'></div>

          {/* Second batch */}
          <div className='partition'>
            <label>
             
              <span className='custom-radio'></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Sep 1 2024 <span className='date-span'>(Sunday)</span></p>
                <p className='batch-date'>07:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle style={{ marginRight:'1vh', height:'20px', width:'20px' }}/>Live Demo</p>
              </div>
            </label>
          </div>

          <div className='separator'></div>

          {/* Third batch */}
          <div className='partition'>
            <label>
             
              <span className='custom-radio'></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Oct 5 2024 <span className='date-span'>(Saturday)</span></p>
                <p className='batch-date'>05:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle style={{ marginRight:'1vh', height:'20px', width:'20px' }}/>Live Demo</p>
              </div>
            </label>
          </div>
        </div>
        
        <LiveOnlineFeesRight fee="Free" enrollText="Enroll Now" />
      </div>
    </>
  );
};

export default LiveOnlineFees;
